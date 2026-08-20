package com.renew.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.renew.app.data.*
import com.renew.app.ui.theme.NeonOrange
import java.time.LocalDate
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TaskEditDialog(
    initialTask: TaskEntity? = null,
    onSave: (TaskEntity) -> Unit,
    onDelete: ((TaskEntity) -> Unit)? = null,
    onDismiss: () -> Unit
) {
    var title by remember { mutableStateOf(initialTask?.title ?: "") }
    var description by remember { mutableStateOf(initialTask?.description ?: "") }
    var location by remember { mutableStateOf(initialTask?.locationOrAsset ?: "") }
    var category by remember { mutableStateOf(initialTask?.category ?: CategoryType.HVAC_APPLIANCES) }
    var recurrenceValue by remember { mutableStateOf(initialTask?.recurrenceValue?.toString() ?: "1") }
    var recurrenceUnit by remember { mutableStateOf(initialTask?.recurrenceUnit ?: RecurrenceUnit.MONTHS) }
    var nextDueDate by remember { mutableStateOf(initialTask?.nextDueDate ?: LocalDate.now().toString()) }
    var estimatedCost by remember { mutableStateOf(if ((initialTask?.estimatedCost ?: 0.0) > 0) initialTask?.estimatedCost.toString() else "") }
    var isWeeklyRoutine by remember { mutableStateOf(initialTask?.isWeeklyRoutine ?: false) }
    var priority by remember { mutableStateOf(initialTask?.priority ?: PriorityLevel.MEDIUM) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(0.dp),
            color = MaterialTheme.colorScheme.background,
            border = BorderStroke(2.dp, NeonOrange)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = if (initialTask == null) "NEW MAINTENANCE TASK" else "EDIT TASK",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )

                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Task Title *") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(0.dp)
                )

                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = { Text("Location / Appliance / Asset") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(0.dp)
                )

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description & Notes") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3,
                    shape = RoundedCornerShape(0.dp)
                )

                // Category selector
                Text("Category", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    CategoryType.values().take(3).forEach { cat ->
                        FilterChip(
                            selected = category == cat,
                            onClick = { category = cat },
                            label = { Text(cat.name.take(6), fontSize = 10.sp) },
                            shape = RoundedCornerShape(0.dp)
                        )
                    }
                }

                // Recurrence
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = recurrenceValue,
                        onValueChange = { recurrenceValue = it },
                        label = { Text("Every") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(0.dp)
                    )
                    OutlinedTextField(
                        value = nextDueDate,
                        onValueChange = { nextDueDate = it },
                        label = { Text("Next Due (YYYY-MM-DD)") },
                        modifier = Modifier.weight(2f),
                        shape = RoundedCornerShape(0.dp)
                    )
                }

                OutlinedTextField(
                    value = estimatedCost,
                    onValueChange = { estimatedCost = it },
                    label = { Text("Estimated Cost Per Cycle ($)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(0.dp)
                )

                // Weekly Routine Toggle
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Flexible 'On This Week' Routine", style = MaterialTheme.typography.bodyMedium)
                    Switch(checked = isWeeklyRoutine, onCheckedChange = { isWeeklyRoutine = it })
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (initialTask != null && onDelete != null) {
                        OutlinedButton(
                            onClick = { onDelete(initialTask) },
                            shape = RoundedCornerShape(0.dp)
                        ) {
                            Text("DELETE", color = Color.Red)
                        }
                    }
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(0.dp)
                    ) {
                        Text("CANCEL")
                    }
                    Button(
                        onClick = {
                            if (title.isNotBlank()) {
                                val task = TaskEntity(
                                    id = initialTask?.id ?: UUID.randomUUID().toString(),
                                    title = title.trim(),
                                    description = description.trim(),
                                    category = category,
                                    recurrenceValue = recurrenceValue.toIntOrNull() ?: 1,
                                    recurrenceUnit = recurrenceUnit,
                                    nextDueDate = nextDueDate.trim(),
                                    locationOrAsset = location.ifBlank { null },
                                    estimatedCost = estimatedCost.toDoubleOrNull() ?: 0.0,
                                    isWeeklyRoutine = isWeeklyRoutine,
                                    priority = priority,
                                    history = initialTask?.history ?: emptyList()
                                )
                                onSave(task)
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(0.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = NeonOrange, contentColor = Color.Black)
                    ) {
                        Text("SAVE", fontWeight = FontWeight.Black)
                    }
                }
            }
        }
    }
}
