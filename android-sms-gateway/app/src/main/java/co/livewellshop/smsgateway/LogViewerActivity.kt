package co.livewellshop.smsgateway

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import co.livewellshop.smsgateway.databinding.ActivityLogViewerBinding

/**
 * Full-screen activity for viewing SMS Gateway logs
 */
class LogViewerActivity : AppCompatActivity(), AppLogger.LogListener {
    
    private lateinit var binding: ActivityLogViewerBinding
    private lateinit var adapter: LogAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        try {
            binding = ActivityLogViewerBinding.inflate(layoutInflater)
            setContentView(binding.root)
            
            // Setup toolbar
            setSupportActionBar(binding.toolbar)
            supportActionBar?.setDisplayHomeAsUpEnabled(true)
            supportActionBar?.title = "Activity Logs"
        } catch (e: Exception) {
            Log.e("LogViewerActivity", "Error in onCreate", e)
            Toast.makeText(this, "Error initializing log viewer: ${e.message}", Toast.LENGTH_LONG).show()
            finish()
            return
        }
        
        // Setup RecyclerView
        adapter = LogAdapter()
        binding.rvLogs.layoutManager = LinearLayoutManager(this)
        binding.rvLogs.adapter = adapter
        
        // Setup listeners
        AppLogger.addListener(this)
        displayAllLogs()
        
        // Select All button
        binding.btnSelectAll.setOnClickListener {
            adapter.selectAll()
            Toast.makeText(this, "All logs selected", Toast.LENGTH_SHORT).show()
        }
        
        // Copy button
        binding.btnCopy.setOnClickListener {
            val selectedLogs = adapter.getSelectedLogs()
            if (selectedLogs.isEmpty()) {
                Toast.makeText(this, "No logs selected", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            
            val text = selectedLogs.joinToString("\n") { it.toString() }
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("SMS Gateway Logs", text)
            clipboard.setPrimaryClip(clip)
            
            adapter.clearSelection()
            Toast.makeText(this, "${selectedLogs.size} logs copied to clipboard", Toast.LENGTH_SHORT).show()
        }
        
        // Clear logs button
        binding.btnClearLogs.setOnClickListener {
            AppLogger.clearLogs()
            displayAllLogs()
            Toast.makeText(this, "Logs cleared", Toast.LENGTH_SHORT).show()
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
    
    /**
     * Display all logs in the RecyclerView
     */
    private fun displayAllLogs() {
        val logs = AppLogger.getAllLogs()
        
        if (logs.isEmpty()) {
            binding.rvLogs.visibility = View.GONE
            binding.tvEmpty.visibility = View.VISIBLE
            binding.tvLogCount.text = "0 logs"
        } else {
            binding.rvLogs.visibility = View.VISIBLE
            binding.tvEmpty.visibility = View.GONE
            binding.tvLogCount.text = "${logs.size} logs"
            adapter.setLogs(logs)
            
            // Auto-scroll to bottom
            binding.rvLogs.post {
                binding.rvLogs.smoothScrollToPosition(logs.size - 1)
            }
        }
    }
    
    /**
     * Handle new log entries (LogListener interface)
     */
    override fun onNewLog(entry: AppLogger.LogEntry) {
        runOnUiThread {
            if (binding.rvLogs.visibility == View.GONE) {
                binding.rvLogs.visibility = View.VISIBLE
                binding.tvEmpty.visibility = View.GONE
            }
            
            adapter.addLog(entry)
            binding.tvLogCount.text = "${AppLogger.getAllLogs().size} logs"
            
            // Auto-scroll to bottom
            binding.rvLogs.smoothScrollToPosition(adapter.itemCount - 1)
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        AppLogger.removeListener(this)
    }
}
