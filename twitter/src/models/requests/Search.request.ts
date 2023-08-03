import { MediaTypeQuery } from '~/constants/enum'
import { Pagination } from './Tweet.request'

export interface SearchQuery extends Pagination {
  content: string
  media_type: MediaTypeQuery
}
