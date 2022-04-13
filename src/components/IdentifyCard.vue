<template>
  <v-hover>
    <template v-slot:default="{ hover }">

      <v-card
        :width="width"
        @click="onClick"
      >
        <v-img
          :src="item.imageUrl"
          aspect-ratio="0.7071"
          contain/>
        <v-overlay
          v-if="hover || selected "
          absolute
          :opacity="hover ? 0.3 : 0"
          :class="`${hover  ? 'item-border-darken' : selected ? 'item-border' : 'item-border-transparent'} overlay-full`"
        >
        </v-overlay>
        <v-card-text>
          <div>{{ item.title }}</div>
          <div>{{ item.provider }}</div>
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import {SearchResult} from '@/types/metadata'

export default Vue.extend({
  name: 'IdentifyCard',
  props: {
    item: {
      type: Object as () => SearchResult,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    width: {
      type: [String, Number],
      required: false,
      default: 150,
    },
  },
  methods: {
    onClick() {
      this.$emit('on-select-result', this.item)
    },
  },
})
</script>
