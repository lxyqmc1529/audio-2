import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/list',
    name: 'list',
    component: Layout,
    redirect: '/list/base',
    meta: {
      title: '语音数据导入',
      icon: 'check-circle',
    },
    children: [
      {
        path: 'base',
        name: 'ListBase',
        component: () => import('@/pages/list/base/index.vue'),
        meta: {
          title: '导入页',
        },
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    component: Layout,
    redirect: '/form/base',
    meta: {
      title: '语音识别',
      icon: 'article',
    },
    children: [
      {
        path: 'base',
        name: 'FormBase',
        component: () => import('@/pages/form/base/index.vue'),
        meta: {
          title: '识别页',
        },
      },
    ],
  },
  {
    path: '/information',
    name: 'information',
    component: Layout,
    redirect: '/information/base',
    meta: {
      title: '信息分类',
      icon: 'blockchain',
    },
    children: [
      {
        path: 'base',
        name: 'InformationBase',
        component: () => import('@/pages/Information/base/index.vue'),
        meta: {
          title: '分类页',
        },
      },
    ],
  },
  {
    path: '/charts',
    name: 'charts',
    component: Layout,
    redirect: '/charts/base',
    meta: {
      title: '统计报表',
      icon: 'chart-colum',
    },
    children: [
      {
        path: 'charts',
        name: 'ChartsBase',
        component: () => import('@/pages/charts/base/index.vue'),
        meta: {
          title: '报表页',
        },
      },
    ],
  },
];
