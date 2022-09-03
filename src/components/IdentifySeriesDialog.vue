<template>
  <v-dialog v-model="modal"
            :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="800"
            :persistent=loading
            @keydown.esc="dialogCancel"
  >
    <form novalidate>
      <v-card>

        <v-card-title class="hidden-xs-only">
          <v-icon class="mx-4">mdi-pencil</v-icon>
          Identify
        </v-card-title>

        <v-card flat v-if="search">
          <v-toolbar class="hidden-sm-and-up" id="identify_toolbar">
            <v-btn icon @click="dialogCancel">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Identify</v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
              <v-btn
                text color="primary"
                :loading="loading"
                :disabled="loading || form.title === ''"
                @click="searchSeries"
              >
                Search
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-container fluid>

            <v-text-field v-model="form.title"
                          label="title"
                          filled
                          dense
                          :error-messages="requiredErrors('title')"
                          @input="$v.form.title.$touch()"
                          @blur="$v.form.title.$touch()"
            >
            </v-text-field>

            <v-text-field v-model="form.edition"
                          label="edition"
                          filled
                          dense
                          @input="$v.form.edition.$touch()"
                          @blur="$v.form.title.$touch()"
            >
            </v-text-field>

            <v-card-actions class="hidden-xs-only">
              <v-spacer/>
              <v-btn
                class="ma-2"
                :loading="loading"
                :disabled="loading || form.title === ''"
                color="secondary"
                @click="searchSeries"
              >
                Search
              </v-btn>
            </v-card-actions>

          </v-container>
        </v-card>

        <v-card flat v-if="results">
          <v-toolbar class="hidden-sm-and-up">
            <v-btn icon @click="dialogCancel">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Identify</v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
              <v-btn color="primary" :disabled="!selected" @click="dialogConfirm">Confirm</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-container fluid>
            <v-row>
              <v-col
                align="center"
                cols="4" sm="3" lg="3" class="pa-1"
                v-for="(item, index) in searchResults"
                :key="index"
              >
                <!--      Thumbnail-->
                <identify-card
                  :item="item"
                  :selected="isResultSelected(item)"
                  @on-select-result="selectResult"
                >
                </identify-card>
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions class="hidden-xs-only" v-if="results">
            <v-spacer/>
            <v-btn text @click="dialogCancel" :disabled="loading">Cancel</v-btn>
            <v-btn
              color="primary"
              :disabled="!selected || loading"
              :loading="loading"
              @click="dialogConfirm"
            >Confirm
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import {helpers, requiredIf} from 'vuelidate/lib/validators'
import {IdentifyRequest, SearchResult} from '@/types/metadata'
import IdentifyCard from '@/components/IdentifyCard.vue'
import {ERROR, ErrorEvent} from '@/types/events'

const validLanguage = (value: string) => !helpers.req(value)

export default Vue.extend({
  name: 'IdentifySeriesDialog',
  components: {IdentifyCard},
  data: () => {
    return {
      modal: false,
      tab: 0,
      search: true,
      results: false,
      loading: false,
      uploading: false,
      selected: false,
      form: {
        title: '',
        edition: '',
      },
      edition: '',
      searchResults: [] as SearchResult[],
      selectedResult: {} as SearchResult,
    }
  },
  props: {
    value: Boolean,
    seriesTitle: String,
  },
  watch: {
    value(val) {
      this.modal = val
    },
    seriesTitle(title) {
      this.form.title = title
    },
    modal(val) {
      if (val) {
      } else {
        this.dialogCancel()
      }
    },
    seriesId() {
      this.dialogReset()
    },
  },
  validations: {
    form: {
      title: {
        required: requiredIf(function (this: any, model: any) {
          return this.single
        }),
      },
      edition: {},
    },
  },
  computed: {
    seriesId(): string | undefined {
      const pathNameArray = window.location.pathname.split('/') || ['']
      let seriesId = pathNameArray.pop()
      if (seriesId === '') {
        seriesId = pathNameArray.pop()
      }

      return seriesId
    },
  },
  methods: {
    requiredErrors(fieldName: string): string[] {
      const errors = [] as string[]
      const formField = this.$v.form!![fieldName] as any
      if (!formField.$dirty) return errors
      !formField.required && errors.push('Required')
      return errors
    },
    dialogReset() {
      this.tab = 0
      this.form.title = this.seriesTitle
      this.form.edition = ''
      this.edition = ''
      this.search = true
      this.loading = false
      this.results = false
      this.selected = false
      this.searchResults = []
      this.$v.$reset()
    },
    dialogCancel() {
      this.$emit('input', false)
      this.dialogReset()
    },
    async dialogConfirm() {
      this.loading = true
      if (await this.editMetadata()) {
        this.$emit('input', false)
      }
    },
    async searchSeries() {
      this.loading = true
      try {
        this.searchResults = await this.$komfMetadata.searchSeries(this.form.title)
      } catch (e) {
        this.$eventHub.$emit(ERROR, {message: e.message} as ErrorEvent)
        this.dialogCancel()
        return
      }
      this.results = true
      this.search = false
      this.loading = false
      this.edition = this.form.edition
    },
    async editMetadata(): Promise<boolean> {
      if (this.seriesId) {
        const request: IdentifyRequest = {
          seriesId: this.seriesId,
          provider: this.selectedResult.provider,
          providerSeriesId: this.selectedResult.resultId,
          edition: this.edition == '' ? undefined : this.edition,
        }
        await this.$komfMetadata.identifySeries(request)
        return true
      }
      return false
    },
    async selectResult(searchResult: SearchResult) {
      this.selectedResult = searchResult
      this.selected = true
    },
    isResultSelected(item: SearchResult): boolean {
      return this.selectedResult === item
    },
  },
})
</script>
