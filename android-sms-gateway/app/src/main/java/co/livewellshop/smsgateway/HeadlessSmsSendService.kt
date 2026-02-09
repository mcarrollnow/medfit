package co.livewellshop.smsgateway

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log

/**
 * Headless service required for "Respond via Message" functionality
 * This is needed to be recognized as a default SMS app
 */
class HeadlessSmsSendService : Service() {
    
    companion object {
        private const val TAG = "HeadlessSmsSendService"
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "Respond via message intent received")
        
        // Extract phone number and message from intent
        val recipients = intent?.getStringArrayExtra("android.intent.extra.TEXT")
        val message = intent?.getStringExtra("android.intent.extra.TEXT")
        
        if (recipients != null && message != null) {
            // This would send the SMS, but we don't need this functionality
            // Just log it for now
            Log.d(TAG, "Quick reply SMS requested to: ${recipients.joinToString()}")
        }
        
        stopSelf(startId)
        return START_NOT_STICKY
    }
}
