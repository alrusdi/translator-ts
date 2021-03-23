import { defineComponent } from "vue";
import { TranslationEditor } from "./TranslationEditor";

interface Language {
    code: string;
    title: string;
}
  
interface Translation {
    id: number | undefined;
    value: string;
    language: Language;
}
  
interface Source {
    value: string;
    translations: Array<Translation>;
}


interface TranslationsListData {
    isLoading: boolean;
    languages: Array<Language>;
    searchTerm: string;
    currentLanguage: string;
    sources: Array<Source>
}

export const TranslationsList = defineComponent({
    data() {
        return {
          isLoading: true,
          languages: [],
          searchTerm: "",
          currentLanguage: "all",
          sources: []
        } as TranslationsListData;
    },
    components: {
        TranslationEditor,
    },
    methods: {
        isLangNeeded(lang: Language): boolean {
            const curLang = this.currentLanguage;
            if ( ! curLang || curLang === "all") return true;
            return curLang === lang.code;
        },
        getTranslationForLanguage(source: Source, lang: Language) {
            for (const trans of source.translations) {
                if (trans.language.code === lang.code) return trans;
            }
            return undefined;
        },
        getTranslations(source: Source) {
            const translations: Array<Translation> = [];
            this.languages.forEach(
                (language) => {
                    if (this.isLangNeeded(language)) {
                        let trans = this.getTranslationForLanguage(source, language);
                        if (trans === undefined) {
                            trans = {
                                "id": undefined,
                                "language": language,
                                "value": ""
                            }
                        }
                        translations.push(trans);
                    }
                }
            );
            return translations;
        }
    },
    computed: {
      sourcesComputed() {
          let sources: Array<Source> = (this as any).sources;
          if (this.searchTerm) {
              sources = sources.filter((s) => s.value.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
          }
          return sources
      }
    },
    mounted () {
      fetch("/api/get-translations-info/")
          .then(response => response.json())
          .then(info => {
            this.languages = info.languages;
            this.sources=info.sources;
            this.isLoading=false
          })
    },

    template: `
    <div class="translations-list">
        <h2 v-if="isLoading">Data is loading. Please wait...</h2>
        <div class="main-container" v-else>
        <div class="translations-toolbox">
            <form class="form-inline" autocomplete="off">
                <label class="sr-only" for="search">Search</label>
                <div class="input-group mb-2 mr-sm-2">
                    <input type="text" class="form-control" name="q" id="search" placeholder="Search" v-model="searchTerm">
                </div>

                <div class="form-check mb-2 mr-sm-2">
                    <select name="lang" class="form-control" v-model="currentLanguage">
                        <option value="all">all</option>
                        <option v-for="lang in languages" :value="lang.code">{{ lang.title }}</option>
                    </select>
                </div>
            </form>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th width="20%">src</th>
                    <th>i18n</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="source in sourcesComputed">
                    <td>{{ source.value }}</td>
                    <td>
                        <div class="translations-list">
                            <TranslationEditor :source="source" :trans="trans" v-for="trans in getTranslations(source)" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
    `
});