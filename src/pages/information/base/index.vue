<template>
  <div class="t-table-demo__editable-row">
    <div>
      <t-button @click="onValidateTableData">确认</t-button>
    </div>
    <br />
    <!-- 当前示例包含：输入框、单选、多选、日期 等场景 -->
    <t-table
      ref="tableRef"
      row-key="key"
      :columns="columns"
      :data="data"
      :editable-row-keys="editableRowKeys"
      table-layout="fixed"
      bordered
      lazy-load
      @row-edit="onRowEdit"
      @row-validate="onRowValidate"
      @validate="onValidate"
    />
  </div>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue';
import { Input, Select, Textarea } from 'tdesign-vue-next';
import dayjs from 'dayjs';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next';
const statusNameListMap = {
  0: { label: '识别成功', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '识别失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '识别超时', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['13543554', '354543', '6543'][i % 3],
  user: {
    firstName: ['13543554', '354543', '6543'][i % 3],
  },
  status: i % 3,
  letters: [
    '1 这个情况先帮您记录吧，好吧？还是关于大木桥路噪音的情况对吧？他们就是死活不承认这个噪音有问题，我就服了，真的服了，让我自己来找第三方撤。好了，我自己买个转移分贝仪，到时候我如果检测出超超分贝之后，我可能就不仅仅是投资这么简单，不仅仅改那么简单，就是你要追究你的责任了，追究他们的责任了。就是知道就是明明知道是有问题，就是不承认死不承认，就觉得老百姓拿他没办法，就这感觉。好的，要么您这边先结束，不然我没有办法去联系了。嗯好，感谢您来电啊，再见。',
    '1 车站这边没有对外电话的，您有什么需要您说？2 我就是今天晚上那个噪音特别大，我现在要求地铁站的相关值班人员现在立马后来听这个噪音有多大，他们一直不承认噪音的。我这边可以把这个情况反馈给车站，让他们来呃来联系您。让他现在现在呢对，然后现在就立马联系我，那今天晚上就听这个噪音有多大，他自己有良心的，我自己来听一听噪音有多大，最好值班站长来，对吗？现在。',
    '我有两个事情，第一个之前反映干部交流电源，它那个噪音污染现在依旧没解决，这是第一个问题。上次我反映了他们有什么反馈，我要要求他们提供了三方面的问题。他今天早上回电话的时候，我在地铁上说没听清。他那边有给你记录吗？就是你最近一次是6月26号来电，26号来电之后是今天回复你的是吧？但是那时候我在地铁上说没听清，他说的2345，应该6月25号你打过我们这个电话的。',
  ],
  createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  classify_1: ['投诉', '查询'][i % 2],
  classify_2: ['呕吐物', '空调', '车厢', '自动扶梯'][i % 3],
  classify_3: ['陆家浜路', '松江大学城', '中山北路', '一大会址黄陂南路'][i % 4],
}));

const tableRef = ref();
const align = ref('left');
const data = ref([...initData]);
const editableRowKeys = ref(['1']);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap = {};

const onEdit = (e) => {
  const { id } = e.currentTarget.dataset;
  if (!editableRowKeys.value.includes(id)) {
    editableRowKeys.value.push(id);
  }
};

// 更新 editableRowKeys
const updateEditState = (id) => {
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};

const onCancel = (e) => {
  const { id } = e.currentTarget.dataset;
  updateEditState(id);
  tableRef.value.clearValidateData();
};

const onSave = (e) => {
  // const { id } = e.currentTarget.dataset;
  // currentSaveId.value = id;
  // // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  // tableRef.value.validateRowData(id).then((params) => {
  //   console.log('Event Table Promise Validate:', params);
  //   if (params.result.length) {
  //     const r = params.result[0];
  //     MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
  //     return;
  //   }
  //   // 如果是 table 的父组件主动触发校验
  //   if (params.trigger === 'parent' && !params.result.length) {
  //     const current = editMap[currentSaveId.value];
  //     if (current) {
  //       data.value.splice(current.rowIndex, 1, current.editedRow);
  //       MessagePlugin.success('保存成功');
  //     }
  //     updateEditState(currentSaveId.value);
  //   }
  // });
  alert('已保存');
};

// 行校验反馈事件，tableRef.value.validateRowData 执行结束后触发
const onRowValidate = (params) => {
  console.log('Event Table Row Validate:', params);
};

function onValidateTableData() {
  // 执行结束后触发事件 validate
  // tableRef.value.validateTableData().then((params) => {
  //   console.log('Promise Table Data Validate:', params);
  //   const cellKeys = Object.keys(params.result);
  //   const firstError = params.result[cellKeys[0]];
  //   if (firstError) {
  //     MessagePlugin.warning(firstError[0].message);
  //   }
  // });
  alert('数据已更新');
}

// 表格全量数据校验反馈事件，tableRef.value.validateTableData() 执行结束后触发
function onValidate(params) {
  console.log('Event Table Data Validate:', params);
}

const onRowEdit = (params) => {
  const { row, col, value } = params;
  const oldRowData = editMap[row.key]?.editedRow || row;
  const editedRow = { ...oldRowData, [col.colKey]: value };
  editMap[row.key] = {
    ...params,
    editedRow,
  };

  // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
  // const newData = [...data.value];
  // newData[rowIndex] = editedRow;
  // data.value = newData;
};

const STATUS_OPTIONS = [
  { label: '识别成功', value: 0 },
  { label: '识别失败', value: 1 },
];

const columns = computed(() => [
  {
    title: '语音文件ID',
    colKey: 'user.firstName',
    align: align.value,
    width: 120,
    // 编辑状态相关配置，全部集中在 edit
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件

      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        autoWidth: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        { required: true, message: '不能为空' },
        { max: 10, message: '字符数量不能超过 20', type: 'warning' },
      ],
      showEditIcon: false,
    },
  },
  // {
  //   title: '识别状态',
  //   colKey: 'status',
  //   cell: (h, { row }) => STATUS_OPTIONS.find((t) => t.value === row.status)?.label,
  //   width:120,
  //   edit: {
  //     // props, 透传全部属性到 Select 组件
  //     props: {
  //       clearable: true,
  //       autoWidth: true,
  //       options: STATUS_OPTIONS,
  //     },
  //     // 校验规则，此处同 Form 表单
  //     rules: [{ required: true, message: '不能为空' }],
  //     showEditIcon: false,
  //     on: ({ updateEditedCellValue }) => ({
  //       onChange: () => {
  //         /**
  //          * change other columns edited cell value
  //          * 更新本行其他编辑态单元格的数据(to update editedRow)
  //          */
  //         updateEditedCellValue({
  //           isUpdateCurrentRow: true,
  //           letters: [],
  //           // 'user.firstName': '',
  //           // createTime: dayjs().add(1, 'day').toDate(),
  //         });
  //         /**
  //          * update edited row data with row unique value is qual to 2
  //          * 更新行唯一标识值为 2 的编辑态数据
  //          */
  //         // updateEditedCellValue({ rowValue: 2, letters: [] });
  //       },
  //     }),
  //   },
  // },
  {
    colKey: 'status',
    title: '识别状态',
    width: '120',
    cell: (h, { row }) => {
      return (
        <t-tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
          {statusNameListMap[row.status].icon}
          {statusNameListMap[row.status].label}
        </t-tag>
      );
    },
  },
  {
    title: '识别文本',
    colKey: 'letters',
    cell: (h, { row }) => row.letters.join('、'),
    align: align.value,
    width: 600,
    edit: {
      component: Textarea,
      /**
       * 1. pass props to Select
       * 2. props 为函数时，参数有：col, row, rowIndex, colIndex, editedRow，updateEditedCellValue。一般用于实现编辑组件之间的联动
       * 3. updateEditedCellValue used to update value of editable cell
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      props: ({ col, row, rowIndex, colIndex, editedRow, updateEditedCellValue }) => {
        console.log(editedRow);
        return {
          multiple: true,
          minCollapsedNum: 1,
          autoWidth: true,
          autosize: true,
        };
      },
      // 校验规则，此处同 Form 表单
      rules: [
        // { validator: (val) => val && val.length < 3, message: '数量不能超过 2 个' },
        // { validator: (val) => Boolean(val?.length), message: '至少选择一个' },
      ],
      showEditIcon: false,
    },
  },
  {
    title: '分类1',
    colKey: 'classify_1',
    width: 120,
    className: 't-demo-col__datepicker',
    edit: {
      component: Input,
      // props, 透传全部属性到 DatePicker 组件
      props: { allowInput: true },
      showEditIcon: false,
      // 校验规则，此处同 Form 表单
      rules: [{}],
    },
  },
  {
    title: '分类2',
    colKey: 'classify_2',
    width: 120,
    className: 't-demo-col__datepicker',
    edit: {
      component: Input,
      // props, 透传全部属性到 DatePicker 组件
      props: { allowInput: true },
      showEditIcon: false,
      // 校验规则，此处同 Form 表单
      rules: [{}],
    },
  },
  {
    title: '分类3',
    colKey: 'classify_3',
    className: 't-demo-col__datepicker',
    width: 120,
    edit: {
      component: Input,
      // props, 透传全部属性到 DatePicker 组件
      props: { allowInput: true },
      showEditIcon: false,
      // 校验规则，此处同 Form 表单
      rules: [{}],
    },
  },
  {
    title: '创建日期',
    colKey: 'createTime',
    className: 't-demo-col__datepicker',
    width: 120,
    edit: {
      // props, 透传全部属性到 DatePicker 组件
      props: { allowInput: true },
      showEditIcon: false,
      // 校验规则，此处同 Form 表单
      rules: [{}],
    },
  },
  {
    title: '操作栏',
    colKey: 'operate',
    width: 120,
    fixed: 'right',
    cell: (h, { row }) => {
      const editable = editableRowKeys.value.includes(row.key);
      return (
        <div class="table-operations">
          {!editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onEdit}>
              编辑
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onSave}>
              保存
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onCancel}>
              取消
            </t-link>
          )}
        </div>
      );
    },
  },
]);
</script>

<style>
.t-table-demo__editable-row {
  width: 100%;
}
</style>
