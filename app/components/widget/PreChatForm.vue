<!--
  PreChatForm Component

  Renders a dynamic pre-chat form based on formFields configuration.
  Each field is rendered according to its fieldType:
  - text    → UInput
  - email   → UInput type=email
  - phone   → UInput type=tel
  - number  → UInput type=number
  - textarea → UTextarea
  - select  → USelect

  Validation is built dynamically using Zod based on isRequired flags.

  @props formFields     - Array of FormFieldResponse defining the form
  @props welcomeMessage - Optional welcome message displayed above the form
  @emits submit         - Fired with form values as Record<string, string>
-->
<template>
  <div class="flex flex-col h-full">
    <!-- Welcome message -->
    <div v-if="welcomeMessage" class="px-4 pt-4 pb-2">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ welcomeMessage }}
      </p>
    </div>

    <!-- Form -->
    <form class="flex-1 overflow-y-auto px-4 py-3 space-y-4" @submit.prevent="handleSubmit">
      <div v-for="field in sortedFields" :key="field.id" class="space-y-1">
        <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ field.label }}
          <span v-if="field.isRequired" class="text-red-500">*</span>
        </label>

        <!-- Text input -->
        <UInput
          v-if="field.fieldType === 'text'"
          v-model="formValues[field.fieldName]"
          :placeholder="field.placeholder ?? ''"
          size="sm"
        />

        <!-- Email input -->
        <UInput
          v-else-if="field.fieldType === 'email'"
          v-model="formValues[field.fieldName]"
          type="email"
          :placeholder="field.placeholder ?? ''"
          size="sm"
        />

        <!-- Phone input -->
        <UInput
          v-else-if="field.fieldType === 'phone'"
          v-model="formValues[field.fieldName]"
          type="tel"
          :placeholder="field.placeholder ?? ''"
          size="sm"
        />

        <!-- Number input -->
        <UInput
          v-else-if="field.fieldType === 'number'"
          v-model="formValues[field.fieldName]"
          type="number"
          :placeholder="field.placeholder ?? ''"
          size="sm"
        />

        <!-- Textarea -->
        <UTextarea
          v-else-if="field.fieldType === 'textarea'"
          v-model="formValues[field.fieldName]"
          :placeholder="field.placeholder ?? ''"
          :rows="3"
          size="sm"
        />

        <!-- Select -->
        <USelect
          v-else-if="field.fieldType === 'select'"
          v-model="formValues[field.fieldName]"
          :items="getSelectOptions(field)"
          :placeholder="field.placeholder ?? 'Pilih...'"
          size="sm"
        />

        <!-- Validation error -->
        <p
          v-if="fieldErrors[field.fieldName]"
          class="text-xs text-red-500"
        >
          {{ fieldErrors[field.fieldName] }}
        </p>
      </div>

      <!-- Submit button -->
      <UButton
        type="submit"
        label="Mulai Chat"
        icon="i-lucide-message-circle"
        block
        size="sm"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * PreChatForm — dynamic form from widget configuration
 *
 * Builds form fields and Zod validation schema dynamically
 * based on the formFields config from the API.
 */

import { z } from 'zod'
import type { FormFieldResponse } from '~~/shared/types/form-field'

interface SelectOption {
  label: string
  value: string
}

const props = defineProps<{
  /** Form field definitions from widget config */
  formFields: FormFieldResponse[]
  /** Welcome message shown above the form */
  welcomeMessage?: string
}>()

const emit = defineEmits<{
  /** Emitted with form values when validation passes */
  (e: 'submit', values: Record<string, string>): void
}>()

/** Sort fields by sortOrder */
const sortedFields = computed(() =>
  [...props.formFields]
    .filter(f => f.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder),
)

/** Reactive form values */
const formValues = reactive<Record<string, string>>({})

/** Field-level validation errors */
const fieldErrors = reactive<Record<string, string>>({})

// Initialize form values
watchEffect(() => {
  for (const field of sortedFields.value) {
    if (!(field.fieldName in formValues)) {
      formValues[field.fieldName] = ''
    }
  }
})

/** Build select options from field.options Record */
function getSelectOptions(field: FormFieldResponse): SelectOption[] {
  if (!field.options) return []
  return Object.entries(field.options).map(([value, label]) => ({
    label,
    value,
  }))
}

/** Build dynamic Zod schema from formFields */
function buildSchema(): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of sortedFields.value) {
    let fieldSchema: z.ZodTypeAny = z.string()

    if (field.fieldType === 'email') {
      fieldSchema = z.string().email(`${field.label} harus berupa email yang valid`)
    }

    if (field.isRequired) {
      fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} wajib diisi`)
    }
    else {
      fieldSchema = fieldSchema.optional().or(z.literal(''))
    }

    shape[field.fieldName] = fieldSchema
  }

  return z.object(shape)
}

/** Handle form submission with Zod validation */
function handleSubmit(): void {
  // Clear previous errors
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key] = ''
  })

  const schema = buildSchema()
  const result = schema.safeParse(formValues)

  if (!result.success) {
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0]
      if (typeof fieldName === 'string') {
        fieldErrors[fieldName] = issue.message
      }
    }
    return
  }

  emit('submit', { ...formValues })
}
</script>
