import {Page} from "playwright";
import {Dictionary} from "crawlee";

type PushData = (data: Dictionary | Dictionary[]) => Promise<void>
type OnVisitPage = ({page: Page, pushData: PushData}) => void

export type Config = {
  maxPagesToCrawl: number
  selector: string
  waitForSelectorTimeout: number
  onVisitPage: OnVisitPage
  match: string | string[]
  resourceExclusions: string[]
  cookie: any[]
  url: string
  maxFileSize: number
  outputFileName: string
  maxTokens: number
}
