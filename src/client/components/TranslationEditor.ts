import { defineComponent } from "vue";

export const TranslationEditor = defineComponent({
    props: ["source", "trans", "current_value"],
    data () {
        return {
            isDataUploading: false,
            editMode: false
        }
    },
    methods: {
        startEditing() {
          this.editMode = true;
        },
        saveTranslation() {
            if (this.isDataUploading) return false;
            this.isDataUploading = true;
            const data = {
                sourceId: this.source.id,
                languageCode: this.trans.language.code,
                value: this.trans.value
            };
            fetch("/api/suggest-translation/", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(info => {
                this.isDataUploading = false;
                this.editMode=false;
                console.log(info)
            });
            return true;
        }
    },
    template: `
      <div class="translation-editor">
          <i class="flag" :class="'flag-'+trans.language.code"/>
          <div v-if="editMode" class="te-content edit-mode">
              <textarea width="100%" v-model="trans.value" class="form-control edit-area"></textarea>
              <input type="button" value="save" class="btn btn-primary"  v-on:click="saveTranslation()" />
              <input type="button" value="cancel" class="btn btn-danger" v-on:click="editMode=false" />
          </div>
          <div v-else class="te-content view-mode">
              <a title="Suggest new translation" v-on:click.prevent="startEditing()" class="edit-button">
                  <i class="fa fa-edit"></i>

                  <span class="view-value">
                    <span v-if="trans.value">{{ trans.value }}</span>
                    <span v-else="trans.value" class="untranslated-value">Not translated yet</span>
                  </span>
              </a>
          </div>
      </div>
    `
  });