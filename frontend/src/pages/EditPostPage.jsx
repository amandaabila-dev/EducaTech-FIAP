import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/api';
import { ButtonLink, PageHeader, Subtitle } from '../styles/ui';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(() => {
    let ativo = true;

    setLoading(true);
    setError('');

    getPost(id)
      .then((data) => {
        if (ativo) setPost(data);
      })
      .catch((err) => {
        if (!ativo) return;
        setError(err.message);
        setPost(null);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(carregar, [carregar]);

  async function handleSubmit(values) {
    await updatePost(id, values);
    navigate('/admin', { state: { message: 'Postagem atualizada com sucesso.' } });
  }

  if (loading) return <Loading label="Carregando postagem…" />;

  if (error) {
    return (
      <>
        <ErrorMessage message={error} onRetry={carregar} />
        <ButtonLink to="/admin" $variant="secondary">
          Voltar para a área do professor
        </ButtonLink>
      </>
    );
  }

  if (!post) return null;

  return (
    <>
      <PageHeader>
        <div>
          <h1>Editar Postagem</h1>
          <Subtitle>Altere os dados e salve para atualizar o conteúdo publicado.</Subtitle>
        </div>
      </PageHeader>

      <PostForm
        initialValues={{
          title: post.title,
          content: post.content,
          author: post.author,
          subject: post.subject || '',
        }}
        submitLabel="Salvar alterações"
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default EditPostPage;
