import hostname from "@/constants/hostname.mjs";

const  getLessonsWithVocabs = async (page, limit, sort, keyword = "", lessonNumber='') => {
  const host = await hostname();
  const res = await fetch(
    `${host}/api/gets/lessons-with-vocabs?page=${page || 1}&&limit=${
      limit || 100
    }&&sort=${sort}&&keyword=${keyword}&&lessonNumber=${lessonNumber}`, {credentials:'include'}
  );
  const data = await res.json();
  return data || [];
};

export default  getLessonsWithVocabs;
