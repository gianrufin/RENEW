package com.renew.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.LocalDate

@Database(entities = [TaskEntity::class], version = 1, exportSchema = false)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "renew_household_db"
                )
                .addCallback(DatabaseCallback())
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    CoroutineScope(Dispatchers.IO).launch {
                        populateInitialTasks(database.taskDao())
                    }
                }
            }

            suspend fun populateInitialTasks(taskDao: TaskDao) {
                val today = LocalDate.now()
                val defaults = listOf(
                    TaskEntity(
                        id = "task_air_filter",
                        title = "Replace AC & Furnace Air Filter",
                        description = "Swap 16x25x1 MERV 11 filter to maintain HVAC airflow and reduce energy consumption.",
                        category = CategoryType.HVAC_APPLIANCES,
                        recurrenceValue = 3,
                        recurrenceUnit = RecurrenceUnit.MONTHS,
                        nextDueDate = today.minusDays(2).toString(),
                        priority = PriorityLevel.HIGH,
                        estimatedCost = 22.50,
                        locationOrAsset = "Main Hallway Intake",
                        qrAssetId = "ASSET-HVAC-MAIN"
                    ),
                    TaskEntity(
                        id = "task_car_oil",
                        title = "Car Engine Oil & Tire Rotation",
                        description = "Full synthetic 5W-30 oil swap, new filter, and 4-wheel rotation check.",
                        category = CategoryType.AUTOMOTIVE,
                        recurrenceValue = 6,
                        recurrenceUnit = RecurrenceUnit.MONTHS,
                        nextDueDate = today.plusDays(3).toString(),
                        priority = PriorityLevel.HIGH,
                        estimatedCost = 75.00,
                        locationOrAsset = "Toyota RAV4 (Garage)"
                    ),
                    TaskEntity(
                        id = "task_bed_sheets",
                        title = "Wash Bed Sheets & Pillowcases",
                        description = "Hot cycle 60°C wash to sanitize and eliminate dust allergens.",
                        category = CategoryType.HYGIENE_HEALTH,
                        recurrenceValue = 1,
                        recurrenceUnit = RecurrenceUnit.WEEKS,
                        nextDueDate = today.plusDays(1).toString(),
                        isWeeklyRoutine = true,
                        priority = PriorityLevel.MEDIUM,
                        locationOrAsset = "Master Bedroom"
                    ),
                    TaskEntity(
                        id = "task_pet_flea",
                        title = "Pet Monthly Flea & Heartworm Chew",
                        description = "Administer NexGard / Heartgard monthly dose to dog.",
                        category = CategoryType.PET_CARE,
                        recurrenceValue = 1,
                        recurrenceUnit = RecurrenceUnit.MONTHS,
                        nextDueDate = today.toString(),
                        priority = PriorityLevel.CRITICAL,
                        estimatedCost = 35.00,
                        locationOrAsset = "Dog (Milo)"
                    ),
                    TaskEntity(
                        id = "task_smoke_alarm",
                        title = "Test Smoke & CO Alarm Sirens",
                        description = "Press test button on hallway & bedroom detectors; verify 9V batteries.",
                        category = CategoryType.SAFETY_SECURITY,
                        recurrenceValue = 1,
                        recurrenceUnit = RecurrenceUnit.MONTHS,
                        nextDueDate = today.plusDays(5).toString(),
                        isWeeklyRoutine = true,
                        priority = PriorityLevel.HIGH,
                        locationOrAsset = "All Detectors"
                    )
                )
                taskDao.insertAll(defaults)
            }
        }
    }
}
