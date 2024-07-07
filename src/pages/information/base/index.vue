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
  1: { label: '识别成功', theme: 'success', icon: <CheckCircleFilledIcon /> },
  2: { label: '识别成功', theme: 'success', icon: <CheckCircleFilledIcon /> },
  // 1: { label: '识别失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  // 2: { label: '识别超时', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['50567975', '37599888'][i % 2],
  user: {
    firstName: ['13543554', '354543', '6543'][i % 3],
  },
  status: i % 3,
  letters: [
   '1: 你好请讲。 2: 就是我想那个知道就是嗯地铁逃生。 1: 你好喂。 2: 喂听到吗？ 1: 唉听得到您说。 2: 就是我想举报一下那个地铁逃票。 1: 逃票怎么了？女士是这样的。 2: 每天早上大概在8:30左右，5号线奉浦大道地铁站，每天都有一个人逃票。 1: 是固定的是这个人还是说有变化的？ 2: 不应该是这个人，因为他今天他这这两天逃课的时候，还踩着别人了。 1: 还踩到别人，他这个人有什么特征吗？ 2: 男性女性我记得男性男性白色衬衣，白色衬衣。 1: 呃你是指他今天是白色衬衣还是天天就是我感觉。 2: 他每天都是。 1: 基本上每天都是这个白色衬衣。 2: 我觉得可以调查今天的监控，今天我看的特别仔细。 1: 那今天大概几点啊？ 2: 8:30 8:30。 1: 上左右左右。啊左右。 2: 对8:30左右，啊但是肯定是8:35以内。 1: 以内好的，那么大概是从哪个哪个几号口这边进去的？丰富大道？ 2: 他是出来。 1: 啊出站。那么大概从几号口出站呢？ 2: 它不就一个闸机嘛，那个闸机不都是都是那个方向的吗？ 1: 好的，我明白了，那具体的话白色车里还有一个服务台的。噢好的，那么除了这个白色衬衣的特征，还有其他特征吗？比方说身高，啊灰色的裤子，戴眼镜，灰色裤子，戴眼镜。 2: 对，戴口罩。 1: 啊还戴口罩。那么他长发短发这个身高什么的有吗？ 2: 有一点点微胖。微胖，但是身高我不知道。这个大概1米31米75以内吧。 1: 1米75左右的对吧？ 2: 好的，因为他每天他前两次还踩到了我的脚。 1: 噢。我明白了，他是相当于是蹭蹭别人的卡出来的是吧？ 2: 就蹭别人的卡然后就出去了，然后就趁着那个站点服务人员，他其实每每天都会在那里兜着嘛，他就看到他看到他往另外一个方向看的时候，他就往反方向逃票。 1: 好的，女士我明白了，您这个情况我要为您受理下来，由相关单位去核实这个情况。好，女士您贵姓啊？怎么称呼？冒昧问一下。 2: 姓李木子李不用反馈给我，我只是说这个人特别不好，因为他踩到我的脚了天哪。因为我两次都碰到他了，而且今天他是肯定我又看到了他，其实很多人都已经看到他了，但人家有些嘛可能就觉得没关系，其实或者是人家觉得这本来就是个人素质问题，其实他逃课他没有关系，他不能踩着别人的脚知道吧？而且贴得很严，主要他是一个男性，我是一个女性，让人感觉很不舒服知道吧？ 1: 噢好我明白了我明白了，这句话我跟你说。 2: 所以不然我是不会说这个事的。 1: 好的好的好的，给您造成不便，深感抱歉了女士。好。 2: 好，麻烦帮我就是反馈一下这个问题吧。 1: 好谢谢，好的好的没关系的啊，那感谢您来电啊女士。嗯再见，好啊。'
  ],
  createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  classify_1: [ '规范服务'][i % 2],
  classify_2: ['车站管理'][i % 2],
  classify_3: [ '逃票'][i % 2],
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
