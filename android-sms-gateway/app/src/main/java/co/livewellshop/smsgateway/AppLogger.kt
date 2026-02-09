package co.livewellshop.smsgateway

import android.util.Log
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ConcurrentLinkedQueue

/**
 * Singleton logger for real-time app logging
 */
object AppLogger {
    private const val TAG = "AppLogger"
    private const val MAX_LOGS = 100
    
    private val logs = ConcurrentLinkedQueue<LogEntry>()
    private val listeners = mutableListOf<LogListener>()
    
    data class LogEntry(
        val timestamp: String,
        val level: LogLevel,
        val tag: String,
        val message: String
    ) {
        override fun toString(): String = "[$timestamp] [$level] $tag: $message"
    }
    
    enum class LogLevel {
        INFO, WARNING, ERROR, SUCCESS
    }
    
    interface LogListener {
        fun onNewLog(entry: LogEntry)
    }
    
    private val dateFormat = SimpleDateFormat("HH:mm:ss", Locale.US)
    
    fun addListener(listener: LogListener) {
        synchronized(listeners) {
            listeners.add(listener)
        }
    }
    
    fun removeListener(listener: LogListener) {
        synchronized(listeners) {
            listeners.remove(listener)
        }
    }
    
    fun info(tag: String, message: String) {
        log(LogLevel.INFO, tag, message)
    }
    
    fun warn(tag: String, message: String) {
        log(LogLevel.WARNING, tag, message)
    }
    
    fun error(tag: String, message: String) {
        log(LogLevel.ERROR, tag, message)
    }
    
    fun success(tag: String, message: String) {
        log(LogLevel.SUCCESS, tag, message)
    }
    
    private fun log(level: LogLevel, tag: String, message: String) {
        val timestamp = dateFormat.format(Date())
        val entry = LogEntry(timestamp, level, tag, message)
        
        // Add to queue
        logs.add(entry)
        
        // Trim if too many
        while (logs.size > MAX_LOGS) {
            logs.poll()
        }
        
        // Log to Android LogCat as well
        when (level) {
            LogLevel.INFO, LogLevel.SUCCESS -> Log.i(TAG, "[$tag] $message")
            LogLevel.WARNING -> Log.w(TAG, "[$tag] $message")
            LogLevel.ERROR -> Log.e(TAG, "[$tag] $message")
        }
        
        // Notify listeners
        synchronized(listeners) {
            listeners.forEach { it.onNewLog(entry) }
        }
    }
    
    fun getAllLogs(): List<LogEntry> = logs.toList()
    
    fun clearLogs() {
        logs.clear()
        info(TAG, "Logs cleared")
    }
}
