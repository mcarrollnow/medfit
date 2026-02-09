package co.livewellshop.smsgateway

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * Firebase Cloud Messaging service that receives send requests from the server
 */
class FcmService : FirebaseMessagingService() {
    
    companion object {
        private const val TAG = "FcmService"
        private const val PREFS_NAME = "sms_gateway_prefs"
        private const val KEY_FCM_TOKEN = "fcm_token"
        
        /**
         * Get the current FCM token
         */
        fun getFcmToken(context: android.content.Context): String? {
            val prefs = context.getSharedPreferences(PREFS_NAME, android.content.Context.MODE_PRIVATE)
            return prefs.getString(KEY_FCM_TOKEN, null)
        }
    }
    
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    
    /**
     * Called when a new FCM token is generated
     */
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New FCM token: $token")
        AppLogger.info(TAG, "🔑 New FCM token received")
        
        // Save token to SharedPreferences
        saveFcmToken(token)
        
        // TODO: Send token to your server for storage
        // You'll need to POST this to an endpoint like /api/sms/register-device
        // Include the token so your server knows where to send FCM messages
    }
    
    /**
     * Called when a message is received from FCM
     */
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        
        Log.d(TAG, "FCM message received")
        Log.d(TAG, "From: ${message.from}")
        Log.d(TAG, "Data: ${message.data}")
        AppLogger.info(TAG, "📥 FCM message received")
        
        // Extract phone number and message from FCM data payload
        val phoneNumber = message.data["phoneNumber"]
        val messageText = message.data["message"]
        
        if (phoneNumber.isNullOrBlank() || messageText.isNullOrBlank()) {
            Log.e(TAG, "Invalid FCM payload: missing phoneNumber or message")
            AppLogger.error(TAG, "❌ Invalid FCM payload")
            return
        }
        
        // Parse optional RCS features from FCM payload
        val rcsFeatures = parseRcsFeatures(message.data)
        
        val messageType = if (rcsFeatures != null) "RCS/SMS" else "SMS"
        Log.d(TAG, "Sending $messageType to: $phoneNumber")
        AppLogger.info(TAG, "📤 Outgoing $messageType to $phoneNumber: ${messageText.take(50)}")
        
        // Send message asynchronously (RCS with SMS fallback)
        scope.launch {
            try {
                val result = SmsSender.sendMessage(
                    phoneNumber = phoneNumber,
                    message = messageText,
                    context = applicationContext,
                    rcsFeatures = rcsFeatures
                )
                
                if (result.isSuccess) {
                    Log.d(TAG, "Message sent successfully via FCM trigger")
                    AppLogger.success(TAG, "✅ Message sent successfully")
                } else {
                    Log.e(TAG, "Failed to send message: ${result.exceptionOrNull()?.message}")
                    AppLogger.error(TAG, "❌ Message send failed: ${result.exceptionOrNull()?.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error sending message", e)
                AppLogger.error(TAG, "❌ Error: ${e.message}")
            }
        }
    }
    
    /**
     * Parse RCS features from FCM data payload
     */
    private fun parseRcsFeatures(data: Map<String, String>): RcsFeatures? {
        // If no RCS features are present, return null
        if (!data.containsKey("rcs_imageUrl") && 
            !data.containsKey("rcs_quickReplies") && 
            !data.containsKey("rcs_brandColor")) {
            return null
        }
        
        val imageUrl = data["rcs_imageUrl"]
        val quickRepliesJson = data["rcs_quickReplies"]
        val brandColor = data["rcs_brandColor"] ?: "#FFF95E" // Default to Live Well yellow
        val title = data["rcs_title"]
        val description = data["rcs_description"]
        
        // Parse quick replies from JSON array string
        val quickReplies = quickRepliesJson?.let { json ->
            try {
                com.google.gson.Gson().fromJson(json, Array<String>::class.java).toList()
            } catch (e: Exception) {
                Log.w(TAG, "Failed to parse quick replies JSON", e)
                null
            }
        }
        
        return RcsFeatures(
            imageUrl = imageUrl,
            quickReplies = quickReplies,
            brandColor = brandColor,
            title = title,
            description = description
        )
    }
    
    /**
     * Save FCM token to SharedPreferences
     */
    private fun saveFcmToken(token: String) {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        prefs.edit().putString(KEY_FCM_TOKEN, token).apply()
        Log.d(TAG, "FCM token saved to preferences")
    }
}
