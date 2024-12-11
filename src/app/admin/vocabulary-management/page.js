import AdminVocabularyList from "@/components/admin/AdminVocabularyList";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getVocabularies from "@/utils/getVocabularies.mjs";

const adminVocabularyPage = async({ searchParams }) => {
    const page = parseInt((await searchParams)?.page) || 1;
    const limit = parseInt((await searchParams)?.limit) || 10;
    const sort = (await searchParams)?.sort || "newest";
    const keyword = (await searchParams)?.keyword || "";
    let vocabularies;
    let totalCount;
    try {
        const d = await getVocabularies(page, limit, sort, keyword);
        vocabularies = d?.vocabularies;
        totalCount = d?.totalCount || 0;
        
      } catch (error) {
        console.log(error);
        vocabularies = null;
      }
      const totalPages = Math.ceil(totalCount / limit);
      if (!vocabularies) return <NotFound />;
      return (
        <>
          <AdminVocabularyList v={vocabularies} />
          {totalPages > page &&  <PaginationDefault p={page} totalPages={totalPages}/>}
        </>
      );
};

export default adminVocabularyPage;