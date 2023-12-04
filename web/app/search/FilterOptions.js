import FilterType from '@plurk-search/common/enum/FilterType';

export default {
  [FilterType.NONE]: {
    value: FilterType[FilterType.NONE],
    label: '全部',
  },
  [FilterType.MY]: {
    value: FilterType[FilterType.MY],
    label: '我發表的訊息',
  },
  [FilterType.RESPONDED]: {
    value: FilterType[FilterType.RESPONDED],
    label: '回應過的訊息',
  },
  [FilterType.PRIVATE]: {
    value: FilterType[FilterType.PRIVATE],
    label: '私人訊息',
  },
  [FilterType.FAVORITE]: {
    value: FilterType[FilterType.FAVORITE],
    label: '喜歡的訊息',
  },
  [FilterType.REPLURKED]: {
    value: FilterType[FilterType.REPLURKED],
    label: '轉噗的訊息',
  },
  [FilterType.MENTIONED]: {
    value: FilterType[FilterType.MENTIONED],
    label: '提到我的訊息',
  },
};
