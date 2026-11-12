export type SubjectId = 'math' | 'physics' | 'cs';
export type CourseId = 'number-theory' | 'discrete-math' | 'data-structures';
export type ChapterId =
  | '02-congruence'
  | '03-arithmetic-functions'
  | '04-quadratic-residues'
  | '05-primitive-roots';

export type Subject = {
  id: SubjectId;
  title: string;
  en: string;
  description: string;
  status: 'active' | 'planned';
};

export type Course = {
  id: CourseId;
  subject: SubjectId;
  title: string;
  en: string;
  description: string;
  status: 'active' | 'planned';
};

export type Chapter = {
  id: ChapterId;
  course: CourseId;
  index: string;
  order: number;
  title: string;
  description: string;
};

export const subjects: Record<SubjectId, Subject> = {
  math: {
    id: 'math',
    title: '数学',
    en: 'Mathematics',
    description: '数论、线性代数、微积分，以及那些值得慢慢想清楚的东西。',
    status: 'active',
  },
  physics: {
    id: 'physics',
    title: '物理',
    en: 'Physics',
    description: '力学、电磁学、量子力学。还在排队。',
    status: 'planned',
  },
  cs: {
    id: 'cs',
    title: '编程',
    en: 'Computer Science',
    description: '数据结构、算法、工程实践。还在排队。',
    status: 'planned',
  },
};

export const courses: Record<CourseId, Course> = {
  'number-theory': {
    id: 'number-theory',
    subject: 'math',
    title: '数论',
    en: 'Number Theory',
    description: '从同余出发，经过数论函数、二次剩余，走到原根。',
    status: 'active',
  },
  'discrete-math': {
    id: 'discrete-math',
    subject: 'math',
    title: '离散数学',
    en: 'Discrete Mathematics',
    description: '集合、关系、图论与组合。筹备中。',
    status: 'planned',
  },
  'data-structures': {
    id: 'data-structures',
    subject: 'cs',
    title: '数据结构与算法设计',
    en: 'Data Structures & Algorithms',
    description: '课本习题、算法笔记与实现。筹备中。',
    status: 'planned',
  },
};

export const chapters: Record<ChapterId, Chapter> = {
  '02-congruence': {
    id: '02-congruence',
    course: 'number-theory',
    index: '02',
    order: 2,
    title: '第二章 同余',
    description: '把等式换成同余，把除法换成逆元。',
  },
  '03-arithmetic-functions': {
    id: '03-arithmetic-functions',
    course: 'number-theory',
    index: '03',
    order: 3,
    title: '第三章 数论函数',
    description: '从数论函数出发，一路走到莫比乌斯反演。',
  },
  '04-quadratic-residues': {
    id: '04-quadratic-residues',
    course: 'number-theory',
    index: '04',
    order: 4,
    title: '第四章 二次剩余',
    description: '模 p 之下的平方，以及判别它们的符号。',
  },
  '05-primitive-roots': {
    id: '05-primitive-roots',
    course: 'number-theory',
    index: '05',
    order: 5,
    title: '第五章 原根',
    description: '一个数的次数，和它生成的乘法群。',
  },
};

export const chapterList = Object.values(chapters).sort((a, b) => a.order - b.order);

export const courseList = Object.values(courses);

export function getChaptersForCourse(courseId: CourseId) {
  return chapterList.filter((chapter) => chapter.course === courseId);
}
