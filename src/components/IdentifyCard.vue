<template>
  <q-card v-ripple @click="onClick"
          :class="`${selected ? 'item-border' : '' } identify-card cursor-pointer q-hoverable`">
    <span class="q-focus-helper"></span>

    <q-card-section horizontal class="card-border">
      <div class="full-width" style="padding: 0">
        <q-img :src="item.imageUrl" ratio="0.7071"/>

        <q-card-section class="full-width">
          <div class="text-center ellipsis-2-lines" style="max-height:42px;height:42px">
            {{ item.title }}
            <q-tooltip :delay="500">{{ item.title }}</q-tooltip>
          </div>

          <div class="text-center text-weight-bold ellipsis">{{ providerName }}</div>
        </q-card-section>
      </div>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import type {SearchResult} from '@/types/metadata'
import type {PropType} from 'vue'
import {computed} from "vue";

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
    default: '160px',
  },
})
const providerName = computed(() => {
  return props.item.provider.toLowerCase().split('_')
      .map(token => token.charAt(0).toUpperCase() + token.slice(1))
      .join(' ')
})

function onClick() {
  emit('on-select-result', props.item)
}
</script>

<style scoped lang="scss">
.identify-card {
  max-width: v-bind(width);
  width: v-bind(width);
  border: 3px solid transparent;
  background-color: $darker;
}

.identify-card:hover {
  border: 3px solid $highlight;
}

.item-border {
  border: 3px solid $highlight;
}
</style>
