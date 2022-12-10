<template>
  <q-card v-ripple @click="onClick"
          :class="`${selected ? 'item-border' : '' } identify-card cursor-pointer q-hoverable`">
    <span class="q-focus-helper"></span>

    <q-card-section horizontal class="card-border">
      <q-img :src="item.imageUrl" ratio="0.7071" contain/>
      <q-card-section>
        <div class="text-center">{{ item.title }}</div>
        <div class="text-center text-weight-bold">{{ item.provider }}</div>
      </q-card-section>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import type {SearchResult} from '@/types/metadata'
import type {PropType} from 'vue'

const emit = defineEmits(['on-select-result'])
const props = defineProps({
  item: {
    type: Object as PropType<SearchResult>,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
  width: {
    type: [String],
    required: false,
    default: '150px',
  },
})

function onClick() {
  emit('on-select-result', props.item)
}
</script>

<style scoped lang="scss">
.identify-card {
  max-width: v-bind(width);
  width: v-bind(width);
}

.identify-card:hover {
  border: 3px solid $highlight;
}

.item-border {
  border: 3px solid $highlight;
}
</style>
