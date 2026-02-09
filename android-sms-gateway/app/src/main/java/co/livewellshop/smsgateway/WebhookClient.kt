package co.livewellshop.smsgateway

import android.util.Log
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * HTTP client for forwarding SMS to webhook endpoint
 */
object WebhookClient {
    private const val TAG = "WebhookClient"
    private const val WEBHOOK_URL = "https://modernhealth.pro/api/sms/incoming"
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val gson = Gson()
    private val mediaType = "application/json; charset=utf-8".toMediaType()
    
    /**
     * Forward incoming SMS to webhook
     */
    suspend fun forwardIncomingSms(
        phoneNumber: String,
        message: String,
        timestamp: Long
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "event" to "sms:received",
                "payload" to mapOf(
                    "phoneNumber" to phoneNumber,
                    "message" to message,
                    "receivedAt" to formatTimestamp(timestamp)
                )
            )
            
            val json = gson.toJson(payload)
            Log.d(TAG, "Forwarding SMS: $json")
            
            val requestBody = json.toRequestBody(mediaType)
            val request = Request.Builder()
                .url(WEBHOOK_URL)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .build()
            
            client.newCall(request).execute().use { response ->
                val responseBody = response.body?.string() ?: ""
                
                if (response.isSuccessful) {
                    Log.d(TAG, "SMS forwarded successfully: $responseBody")
                    Result.success(responseBody)
                } else {
                    val error = "Webhook failed: ${response.code} - $responseBody"
                    Log.e(TAG, error)
                    Result.failure(Exception(error))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to forward SMS", e)
            Result.failure(e)
        }
    }
    
    /**
     * Report message send status to webhook (SMS or RCS)
     */
    suspend fun reportSendStatus(
        phoneNumber: String,
        message: String,
        success: Boolean,
        error: String? = null,
        messageType: String = "sms"
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "event" to "sms:sent",
                "payload" to mapOf(
                    "phoneNumber" to phoneNumber,
                    "message" to message,
                    "success" to success,
                    "error" to error,
                    "messageType" to messageType,
                    "sentAt" to formatTimestamp(System.currentTimeMillis())
                )
            )
            
            val json = gson.toJson(payload)
            Log.d(TAG, "Reporting send status: $json")
            
            val requestBody = json.toRequestBody(mediaType)
            val request = Request.Builder()
                .url(WEBHOOK_URL)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .build()
            
            client.newCall(request).execute().use { response ->
                val responseBody = response.body?.string() ?: ""
                
                if (response.isSuccessful) {
                    Log.d(TAG, "Status reported successfully")
                    Result.success(responseBody)
                } else {
                    Log.e(TAG, "Status report failed: ${response.code}")
                    Result.failure(Exception("Failed: ${response.code}"))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to report status", e)
            Result.failure(e)
        }
    }
    
    /**
     * Format timestamp to ISO 8601 format
     */
    private fun formatTimestamp(timestamp: Long): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        return sdf.format(Date(timestamp))
    }
}
