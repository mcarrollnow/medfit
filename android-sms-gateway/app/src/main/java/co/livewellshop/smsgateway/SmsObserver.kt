package co.livewellshop.smsgateway

import android.content.Context
import android.database.ContentObserver
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.Telephony
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * ContentObserver that monitors the SMS database for new incoming messages
 * Works without being the default SMS app
 */
class SmsObserver(private val context: Context) : ContentObserver(Handler(Looper.getMainLooper())) {
    
    companion object {
        private const val TAG = "SmsObserver"
        private const val PREFS_NAME = "sms_gateway_prefs"
        private const val KEY_MESSAGES_RECEIVED = "messages_received"
        private const val KEY_LAST_SMS_ID = "last_sms_id"
    }
    
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private var lastProcessedId: Long = 0
    private var pollingJob: kotlinx.coroutines.Job? = null
    
    init {
        // Load last processed SMS ID
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        lastProcessedId = prefs.getLong(KEY_LAST_SMS_ID, 0)
        
        // If this is first time, get the latest SMS ID so we don't process old messages
        if (lastProcessedId == 0L) {
            val cursor = context.contentResolver.query(
                Telephony.Sms.Inbox.CONTENT_URI,
                arrayOf(Telephony.Sms._ID),
                null,
                null,
                "${Telephony.Sms._ID} DESC LIMIT 1"
            )
            cursor?.use {
                if (it.moveToFirst()) {
                    lastProcessedId = it.getLong(it.getColumnIndexOrThrow(Telephony.Sms._ID))
                    saveLastProcessedId(lastProcessedId)
                    Log.d(TAG, "First run - set lastProcessedId to latest: $lastProcessedId")
                }
            }
        }
        
        Log.d(TAG, "SmsObserver initialized, last processed ID: $lastProcessedId")
    }
    
    override fun onChange(selfChange: Boolean, uri: Uri?) {
        super.onChange(selfChange, uri)
        Log.d(TAG, "SMS database changed, checking for new messages")
        checkForNewMessages()
    }
    
    private fun checkForNewMessages() {
        scope.launch {
            try {
                val cursor = context.contentResolver.query(
                    Telephony.Sms.Inbox.CONTENT_URI,
                    arrayOf(
                        Telephony.Sms._ID,
                        Telephony.Sms.ADDRESS,
                        Telephony.Sms.BODY,
                        Telephony.Sms.DATE
                    ),
                    "${Telephony.Sms._ID} > ?",
                    arrayOf(lastProcessedId.toString()),
                    "${Telephony.Sms._ID} ASC"
                )
                
                cursor?.use {
                    while (it.moveToNext()) {
                        val id = it.getLong(it.getColumnIndexOrThrow(Telephony.Sms._ID))
                        val address = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.ADDRESS))
                        val body = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.BODY))
                        val timestamp = it.getLong(it.getColumnIndexOrThrow(Telephony.Sms.DATE))
                        
                        Log.d(TAG, "New SMS from: $address")
                        Log.d(TAG, "Message: $body")
                        AppLogger.info(TAG, "📨 Incoming SMS from $address: ${body.take(50)}")
                        
                        // Increment received counter
                        incrementReceivedCount()
                        
                        // Forward to webhook
                        val result = WebhookClient.forwardIncomingSms(
                            phoneNumber = address,
                            message = body,
                            timestamp = timestamp
                        )
                        
                        if (result.isSuccess) {
                            Log.d(TAG, "SMS forwarded successfully to webhook")
                            AppLogger.success(TAG, "✅ Forwarded to webhook")
                        } else {
                            Log.e(TAG, "Failed to forward SMS: ${result.exceptionOrNull()?.message}")
                            AppLogger.error(TAG, "❌ Webhook failed: ${result.exceptionOrNull()?.message}")
                        }
                        
                        // Update last processed ID
                        lastProcessedId = id
                        saveLastProcessedId(id)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error checking for new messages", e)
                AppLogger.error(TAG, "Error: ${e.message}")
            }
        }
    }
    
    private fun incrementReceivedCount() {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getInt(KEY_MESSAGES_RECEIVED, 0)
        prefs.edit().putInt(KEY_MESSAGES_RECEIVED, current + 1).apply()
        Log.d(TAG, "Messages received count: ${current + 1}")
    }
    
    private fun saveLastProcessedId(id: Long) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putLong(KEY_LAST_SMS_ID, id).apply()
    }
    
    fun startPolling() {
        pollingJob = scope.launch {
            while (true) {
                try {
                    kotlinx.coroutines.delay(5000) // Check every 5 seconds
                    Log.d(TAG, "Polling check...")
                    checkForNewMessages()
                } catch (e: Exception) {
                    Log.e(TAG, "Polling error", e)
                    AppLogger.error(TAG, "Polling error: ${e.message}")
                }
            }
        }
        Log.d(TAG, "Started polling for new messages every 5 seconds")
    }
    
    fun stopPolling() {
        pollingJob?.cancel()
        pollingJob = null
        Log.d(TAG, "Stopped polling")
    }
}
