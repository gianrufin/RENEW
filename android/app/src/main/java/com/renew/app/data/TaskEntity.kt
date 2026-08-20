package com.renew.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

enum class CategoryType {
    HVAC_APPLIANCES,
    AUTOMOTIVE,
    SAFETY_SECURITY,
    HYGIENE_HEALTH,
    PET_CARE,
    GARDEN_OUTDOOR
}

enum class RecurrenceUnit {
    DAYS,
    WEEKS,
    MONTHS,
    YEARS
}

enum class PriorityLevel {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}

data class ServiceLog(
    val id: String,
    val completedDate: String,
    val cost: Double? = null,
    val notes: String? = null,
    val performer: String? = null
)

@Entity(tableName = "maintenance_tasks")
@TypeConverters(Converters::class)
data class TaskEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val description: String,
    val category: CategoryType,
    val recurrenceValue: Int,
    val recurrenceUnit: RecurrenceUnit,
    val nextDueDate: String, // ISO YYYY-MM-DD
    val lastCompletedDate: String? = null,
    val priority: PriorityLevel = PriorityLevel.MEDIUM,
    val estimatedCost: Double = 0.0,
    val isWeeklyRoutine: Boolean = false,
    val preferredDayOfWeek: Int? = null, // 1 (Mon) to 7 (Sun)
    val locationOrAsset: String? = null,
    val qrAssetId: String? = null,
    val history: List<ServiceLog> = emptyList(),
    val isArchived: Boolean = false
)

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromServiceLogList(value: List<ServiceLog>?): String {
        return gson.toJson(value ?: emptyList<ServiceLog>())
    }

    @TypeConverter
    fun toServiceLogList(value: String?): List<ServiceLog> {
        if (value.isNullOrEmpty()) return emptyList()
        val listType = object : TypeToken<List<ServiceLog>>() {}.type
        return gson.fromJson(value, listType)
    }
}
