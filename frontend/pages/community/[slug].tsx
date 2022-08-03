/*

  コミュニティの情報を表示するページ（インデックスページから飛んだ先）

*/
import type { NextPage } from 'next';
import Header from '../../components/moleculs/Header';
import Footer from '../../components/moleculs/Footer';
import { useEffect, useState } from 'react';
import strapi from '../../service/StrapiService';
import { CommunityReleaseFindOneResponse } from '../../model/StrapiModel';
import { Toolbar } from '../../components/atom/Toolbar';
import Container from '@mui/material/Container';
import { PageTitle } from '../../components/atom/Titles';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import UtilService from '../../service/UtilService';
import MarkdownParser from '../../components/moleculs/MarkdownParser';

const CommunityArticle: NextPage = () => {
  const [article, setArticle] = useState<CommunityReleaseFindOneResponse['data'] | null>(null);
  const router = useRouter();
  const query = router.query;

  // ページの起動時にニュースを取得する
  useEffect(() => {
    if (typeof window === 'object' && query !== undefined && query.slug !== undefined) {
      strapi.findOneCommunityRelease((query as { slug: string }).slug).then((e) => {
        setArticle({ ...e.data });
      });
    }
  }, [query, router]);

  if (article === null) {
    return <div />;
  }

  return (
    <div style={{ marginBottom: '5vh' }}>
      <Container maxWidth="lg" style={{ height: '100%' }}>
        <Header />
        <Toolbar />
        <div
          style={{ marginTop: '10px', display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start', gap: '10px' }}
        >
          <Typography color="text.secondary">作者</Typography>
          <Typography color="text.secondary">{'Symbol address'}</Typography>
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start', gap: '10px' }}>
          <Typography color="text.secondary">作成</Typography>
          <Typography color="text.secondary">
            {UtilService.formatDate(new Date(article.attributes.publishedAt), 'yyyy/MM/dd')}
          </Typography>
          <Typography color="text.secondary">更新</Typography>
          <Typography color="text.secondary">
            {UtilService.formatDate(new Date(article.attributes.updatedAt), 'yyyy/MM/dd')}
          </Typography>
        </div>
        <PageTitle>{article.attributes.title}</PageTitle>
        <MarkdownParser markdown={article.attributes.body} />
        <div style={{ height: '10vh' }} />
        <Footer />
      </Container>
    </div>
  );
};

export default CommunityArticle;
