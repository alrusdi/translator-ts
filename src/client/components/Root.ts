import { defineComponent } from "vue";
import { Navigation } from "./Navigation";
import { TranslationsList } from "./TranslationsList";


export const Root = defineComponent({
    data() {
      return {
        screen: 'initial'
      }
    },
    components: {
        Navigation, 
        TranslationsList
    },
    'template': `
      <div :class="'container-fluid' + 'topmost-'+screen">
        <div>
            <Navigation />
            <div class="card p-5">
                <template v-if="screen === 'initial'">
                  <TranslationsList />
                </template>
                <template v-else-if="screen === 'translations-list'">
                    {{ screen }}
                </template>
            </div>
        </div>
      </div>
    `
})