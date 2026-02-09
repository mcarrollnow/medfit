package co.livewellshop.smsgateway

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.provider.Telephony
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Foreground service that keeps the SMS Gateway running in the background
 */
class SmsGatewayService : Service() {
    
    private var smsObserver: SmsObserver? = null
    
    companion object {
        private const val TAG = "SmsGatewayService"
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "sms_gateway_service"
        private const val CHANNEL_NAME = "SMS Gateway Service"
        
        @Volatile
        var isRunning = false
            private set
        
        /**
         * Start the service
         */
        fun start(context: Context) {
            val intent = Intent(context, SmsGatewayService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
            Log.d(TAG, "Service start requested")
        }
        
        /**
         * Stop the service
         */
        fun stop(context: Context) {
            val intent = Intent(context, SmsGatewayService::class.java)
            context.stopService(intent)
            Log.d(TAG, "Service stop requested")
        }
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Service created")
        createNotificationChannel()
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "Service started")
        isRunning = true
        AppLogger.success(TAG, "SMS Gateway service started")
        
        // Start as foreground service with notification
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
        
        // Register SMS observer to monitor incoming messages
        if (smsObserver == null) {
            smsObserver = SmsObserver(this)
            contentResolver.registerContentObserver(
                Telephony.Sms.CONTENT_URI,
                true,
                smsObserver!!
            )
            smsObserver!!.startPolling() // Also poll every 5 seconds
            Log.d(TAG, "SMS Observer registered with polling")
            AppLogger.info(TAG, "📡 Monitoring SMS database")
        }
        
        // Return START_STICKY to restart service if killed
        return START_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        // We don't provide binding, so return null
        return null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        
        // Unregister SMS observer
        smsObserver?.let {
            it.stopPolling() // Stop polling
            contentResolver.unregisterContentObserver(it)
            Log.d(TAG, "SMS Observer unregistered")
        }
        smsObserver = null
        
        isRunning = false
        AppLogger.warn(TAG, "SMS Gateway service stopped")
        Log.d(TAG, "Service destroyed")
    }
    
    /**
     * Create notification channel (required for Android O+)
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps SMS Gateway running in the background"
                setShowBadge(false)
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
            Log.d(TAG, "Notification channel created")
        }
    }
    
    /**
     * Create the foreground service notification
     */
    private fun createNotification(): Notification {
        // Intent to open MainActivity when notification is tapped
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("SMS Gateway Active")
            .setContentText("Listening for SMS messages")
            .setSmallIcon(android.R.drawable.ic_dialog_email) // Using built-in icon
            .setContentIntent(pendingIntent)
            .setOngoing(true) // Cannot be dismissed
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()
    }
}
