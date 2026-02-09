package co.livewellshop.smsgateway

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import co.livewellshop.smsgateway.databinding.ActivityMainBinding
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Main Activity for SMS Gateway App
 */
class MainActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "MainActivity"
        
        private val REQUIRED_PERMISSIONS = arrayOf(
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.SEND_SMS,
            Manifest.permission.READ_SMS
        )
        
        private val NOTIFICATION_PERMISSION = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            arrayOf(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            emptyArray()
        }
    }
    
    private lateinit var binding: ActivityMainBinding
    private var isServiceRunning = false
    
    /**
     * Permission request launcher
     */
    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.all { it.value }
        
        if (allGranted) {
            Toast.makeText(this, "All permissions granted!", Toast.LENGTH_SHORT).show()
            Log.d(TAG, "All permissions granted")
        } else {
            Toast.makeText(
                this,
                "Some permissions denied. App may not work properly.",
                Toast.LENGTH_LONG
            ).show()
            Log.w(TAG, "Some permissions denied: $permissions")
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize View Binding
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Setup UI
        setupUI()
        
        // Load initial state
        updateUI()
        
        // Get FCM token
        loadFcmToken()
    }
    
    override fun onResume() {
        super.onResume()
        // Update UI when returning to app
        updateUI()
    }
    
    /**
     * Setup UI components and click listeners
     */
    private fun setupUI() {
        // View Logs button
        binding.btnViewLogs.setOnClickListener {
            try {
                val intent = Intent(this, LogViewerActivity::class.java)
                startActivity(intent)
            } catch (e: Exception) {
                Log.e(TAG, "Error launching LogViewerActivity", e)
                Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
        
        // Toggle service button
        binding.btnToggleService.setOnClickListener {
            if (isServiceRunning) {
                stopGatewayService()
            } else {
                startGatewayService()
            }
        }
        
        // Request permissions button
        binding.btnRequestPermissions.setOnClickListener {
            requestPermissions()
        }
        
        // Battery optimization button
        binding.btnBatteryOptimization.setOnClickListener {
            requestBatteryOptimization()
        }
        
        // Copy FCM token button
        binding.btnCopyToken.setOnClickListener {
            copyFcmTokenToClipboard()
        }
    }
    
    /**
     * Update UI based on current state
     */
    private fun updateUI() {
        // Check actual service status
        isServiceRunning = SmsGatewayService.isRunning
        
        if (isServiceRunning) {
            binding.tvServiceStatus.text = getString(R.string.status_running)
            binding.tvServiceStatus.setTextColor(getColor(R.color.green_accent))
            binding.btnToggleService.text = getString(R.string.btn_stop_service)
        } else {
            binding.tvServiceStatus.text = getString(R.string.status_stopped)
            binding.tvServiceStatus.setTextColor(getColor(R.color.red_accent))
            binding.btnToggleService.text = getString(R.string.btn_start_service)
        }
        
        // Update statistics
        binding.tvMessagesSent.text = SmsSender.getSentCount(this).toString()
        binding.tvMessagesReceived.text = SmsSender.getReceivedCount(this).toString()
    }
    
    /**
     * Start the SMS Gateway service
     */
    private fun startGatewayService() {
        if (!checkPermissions()) {
            Toast.makeText(
                this,
                "Please grant all permissions first",
                Toast.LENGTH_SHORT
            ).show()
            return
        }
        
        Log.d(TAG, "Starting SMS Gateway service")
        SmsGatewayService.start(this)
        
        // Update UI after short delay
        lifecycleScope.launch {
            delay(500)
            updateUI()
        }
        
        Toast.makeText(this, "SMS Gateway started", Toast.LENGTH_SHORT).show()
    }
    
    /**
     * Stop the SMS Gateway service
     */
    private fun stopGatewayService() {
        Log.d(TAG, "Stopping SMS Gateway service")
        SmsGatewayService.stop(this)
        
        // Update UI after short delay
        lifecycleScope.launch {
            delay(500)
            updateUI()
        }
        
        Toast.makeText(this, "SMS Gateway stopped", Toast.LENGTH_SHORT).show()
    }
    
    /**
     * Check if all required permissions are granted
     */
    private fun checkPermissions(): Boolean {
        val allPermissions = REQUIRED_PERMISSIONS + NOTIFICATION_PERMISSION
        
        return allPermissions.all { permission ->
            ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED
        }
    }
    
    /**
     * Request all required permissions
     */
    private fun requestPermissions() {
        val allPermissions = REQUIRED_PERMISSIONS + NOTIFICATION_PERMISSION
        
        val missingPermissions = allPermissions.filter { permission ->
            ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED
        }.toTypedArray()
        
        if (missingPermissions.isEmpty()) {
            Toast.makeText(this, "All permissions already granted!", Toast.LENGTH_SHORT).show()
            return
        }
        
        Log.d(TAG, "Requesting permissions: ${missingPermissions.joinToString()}")
        permissionLauncher.launch(missingPermissions)
    }
    
    /**
     * Request battery optimization exemption
     */
    private fun requestBatteryOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            val packageName = packageName
            
            if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = Uri.parse("package:$packageName")
                }
                try {
                    startActivity(intent)
                    Log.d(TAG, "Battery optimization request sent")
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to request battery optimization", e)
                    Toast.makeText(
                        this,
                        "Failed to open battery settings",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            } else {
                Toast.makeText(
                    this,
                    "Battery optimization already disabled!",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    /**
     * Load FCM token and display it
     */
    private fun loadFcmToken() {
        // Check if token is already saved
        val savedToken = FcmService.getFcmToken(this)
        if (savedToken != null) {
            binding.tvFcmToken.text = savedToken
            Log.d(TAG, "Loaded saved FCM token")
        }
        
        // Get fresh token from Firebase
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w(TAG, "Fetching FCM token failed", task.exception)
                binding.tvFcmToken.text = "Failed to get token"
                return@addOnCompleteListener
            }
            
            // Get new FCM token
            val token = task.result
            Log.d(TAG, "FCM token: $token")
            
            // Display token
            binding.tvFcmToken.text = token
            
            // Save token
            val prefs = getSharedPreferences("sms_gateway_prefs", MODE_PRIVATE)
            prefs.edit().putString("fcm_token", token).apply()
        }
    }
    
    /**
     * Copy FCM token to clipboard
     */
    private fun copyFcmTokenToClipboard() {
        val token = binding.tvFcmToken.text.toString()
        
        if (token.isEmpty() || token == "Loading...") {
            Toast.makeText(this, "Token not ready yet", Toast.LENGTH_SHORT).show()
            return
        }
        
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("FCM Token", token)
        clipboard.setPrimaryClip(clip)
        
        Toast.makeText(this, "Token copied to clipboard!", Toast.LENGTH_SHORT).show()
        Log.d(TAG, "FCM token copied to clipboard")
    }
}
