package co.livewellshop.smsgateway

import android.content.Context
import android.telephony.SmsManager
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Handles sending outgoing SMS and RCS messages with automatic fallback
 */
object SmsSender {
    
    private const val TAG = "SmsSender"
    private const val PREFS_NAME = "sms_gateway_prefs"
    private const val KEY_MESSAGES_SENT = "messages_sent"
    
    /**
     * Send a message (RCS if available, otherwise SMS fallback)
     * @param phoneNumber Destination phone number
     * @param message Message text to send
     * @param context Application context
     * @param rcsFeatures Optional RCS rich features (images, quick replies, etc.)
     * @return Result with success/failure
     */
    suspend fun sendMessage(
        phoneNumber: String,
        message: String,
        context: Context,
        rcsFeatures: RcsFeatures? = null
    ): Result<Unit> = withContext(Dispatchers.IO) {
        // TODO: RCS support requires Google Business Communications registration
        // and proper RCS API library. For now, using SMS only.
        // Uncomment below when RCS library is properly configured.
        
        /*
        // Try RCS first if features are requested or if RCS is supported
        if (rcsFeatures != null && RcsManager.isRcsSupported(context)) {
            val rcsManager = RcsManager(context)
            
            // Check if recipient supports RCS
            val isRcsAvailable = rcsManager.isRcsAvailable(phoneNumber)
            
            if (isRcsAvailable) {
                Log.d(TAG, "Sending via RCS to: $phoneNumber")
                val success = rcsManager.sendRcsMessage(
                    phoneNumber = phoneNumber,
                    message = message,
                    imageUrl = rcsFeatures.imageUrl,
                    quickReplies = rcsFeatures.quickReplies,
                    brandColor = rcsFeatures.brandColor
                )
                
                if (success) {
                    incrementSentCount(context)
                    WebhookClient.reportSendStatus(phoneNumber, message, true, null, "rcs")
                    return@withContext Result.success(Unit)
                } else {
                    Log.w(TAG, "RCS send failed, falling back to SMS")
                }
            } else {
                Log.d(TAG, "RCS not available for $phoneNumber, falling back to SMS")
            }
        }
        */
        
        // Send via SMS
        sendSms(phoneNumber, message, context)
    }
    
    /**
     * Send an SMS message (direct SMS, no RCS)
     * @param phoneNumber Destination phone number
     * @param message Message text to send
     * @param context Application context
     * @return Result with success/failure
     */
    suspend fun sendSms(
        phoneNumber: String,
        message: String,
        context: Context
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            Log.d(TAG, "Sending SMS to: $phoneNumber")
            Log.d(TAG, "Message: $message")
            
            // Get SMS manager
            val smsManager = SmsManager.getDefault()
            
            // Split message if it's too long
            val parts = smsManager.divideMessage(message)
            
            if (parts.size == 1) {
                // Send single message
                smsManager.sendTextMessage(
                    phoneNumber,
                    null,
                    message,
                    null,
                    null
                )
            } else {
                // Send multipart message
                smsManager.sendMultipartTextMessage(
                    phoneNumber,
                    null,
                    parts,
                    null,
                    null
                )
            }
            
            // Increment sent counter
            incrementSentCount(context)
            
            Log.d(TAG, "SMS sent successfully (${parts.size} part(s))")
            
            // Report success to webhook
            try {
                WebhookClient.reportSendStatus(phoneNumber, message, true)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to report send status", e)
            }
            
            Result.success(Unit)
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send SMS", e)
            
            // Report failure to webhook
            try {
                WebhookClient.reportSendStatus(phoneNumber, message, false, e.message)
            } catch (reportError: Exception) {
                Log.e(TAG, "Failed to report send error", reportError)
            }
            
            Result.failure(e)
        }
    }
    
    /**
     * Increment the sent message counter
     */
    private fun incrementSentCount(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getInt(KEY_MESSAGES_SENT, 0)
        prefs.edit().putInt(KEY_MESSAGES_SENT, current + 1).apply()
        Log.d(TAG, "Messages sent count: ${current + 1}")
    }
    
    /**
     * Get the current sent message count
     */
    fun getSentCount(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_MESSAGES_SENT, 0)
    }
    
    /**
     * Get the current received message count
     */
    fun getReceivedCount(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt("messages_received", 0)
    }
}

/**
 * RCS rich features data class
 */
data class RcsFeatures(
    val imageUrl: String? = null,
    val quickReplies: List<String>? = null,
    val brandColor: String? = null,
    val title: String? = null,
    val description: String? = null,
    val actionButtons: List<Pair<String, String>>? = null
)
