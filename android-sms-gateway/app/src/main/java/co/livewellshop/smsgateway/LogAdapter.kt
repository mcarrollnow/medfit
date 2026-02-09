package co.livewellshop.smsgateway

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import co.livewellshop.smsgateway.databinding.ItemLogBinding

/**
 * RecyclerView adapter for displaying log entries with checkboxes
 */
class LogAdapter : RecyclerView.Adapter<LogAdapter.LogViewHolder>() {
    
    private val logs = mutableListOf<AppLogger.LogEntry>()
    private val selectedLogs = mutableSetOf<Int>()
    
    fun setLogs(newLogs: List<AppLogger.LogEntry>) {
        logs.clear()
        logs.addAll(newLogs)
        notifyDataSetChanged()
    }
    
    fun addLog(log: AppLogger.LogEntry) {
        logs.add(log)
        notifyItemInserted(logs.size - 1)
    }
    
    fun getSelectedLogs(): List<AppLogger.LogEntry> {
        return selectedLogs.map { logs[it] }
    }
    
    fun clearSelection() {
        selectedLogs.clear()
        notifyDataSetChanged()
    }
    
    fun selectAll() {
        selectedLogs.clear()
        selectedLogs.addAll(logs.indices)
        notifyDataSetChanged()
    }
    
    inner class LogViewHolder(private val binding: ItemLogBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(log: AppLogger.LogEntry, position: Int) {
            binding.tvLogEntry.text = log.toString()
            binding.cbSelect.isChecked = selectedLogs.contains(position)
            
            // Set color based on log level
            val context = binding.root.context
            val textColor = when (log.level) {
                AppLogger.LogLevel.ERROR -> ContextCompat.getColor(context, R.color.red_accent)
                AppLogger.LogLevel.WARNING -> ContextCompat.getColor(context, R.color.orange_accent)
                AppLogger.LogLevel.SUCCESS -> ContextCompat.getColor(context, R.color.green_accent)
                AppLogger.LogLevel.INFO -> ContextCompat.getColor(context, R.color.blue_accent)
            }
            binding.tvLogEntry.setTextColor(textColor)
            
            // Handle checkbox clicks
            binding.cbSelect.setOnClickListener {
                if (binding.cbSelect.isChecked) {
                    selectedLogs.add(position)
                } else {
                    selectedLogs.remove(position)
                }
            }
            
            // Handle row clicks
            binding.root.setOnClickListener {
                binding.cbSelect.isChecked = !binding.cbSelect.isChecked
                if (binding.cbSelect.isChecked) {
                    selectedLogs.add(position)
                } else {
                    selectedLogs.remove(position)
                }
            }
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LogViewHolder {
        val binding = ItemLogBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LogViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: LogViewHolder, position: Int) {
        holder.bind(logs[position], position)
    }
    
    override fun getItemCount(): Int = logs.size
}
