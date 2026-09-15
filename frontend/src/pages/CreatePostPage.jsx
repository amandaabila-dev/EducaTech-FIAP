import { useNavigate } from 'react-router-dom';

import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/api';
import { PageHeader, Subtitle } from '../styles/ui';

function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleSubmit(values) {
    await createPost(values);
    navigate('/admin', { state: { message: 'Postagem criada com sucesso.' } });
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1>Nova Postagem</h1>
          <Subtitle>Publique um novo conteúdo para os alunos.</Subtitle>
        </div>
      </PageHeader>

      <PostForm
        initialValues={{ author: user?.name || '' }}
        submitLabel="Publicar"
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default CreatePostPage;
