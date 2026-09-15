import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorMessage from './ErrorMessage';
import { Actions, Button, Card, Field } from '../styles/ui';

const EMPTY_POST = { title: '', content: '', author: '', subject: '' };

function PostForm({ initialValues = EMPTY_POST, submitLabel = 'Salvar', onSubmit }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...EMPTY_POST, ...initialValues });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = values.title.trim();
    const content = values.content.trim();
    const author = values.author.trim();

    if (!title || !content || !author) {
      setError('Preencha título, conteúdo e autor.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await onSubmit({ title, content, author, subject: values.subject.trim() || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Card>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={255}
            value={values.title}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <label htmlFor="author">Autor</label>
          <input
            id="author"
            name="author"
            type="text"
            maxLength={255}
            value={values.author}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <label htmlFor="subject">Matéria</label>
          <input
            id="subject"
            name="subject"
            type="text"
            maxLength={255}
            value={values.subject ?? ''}
            onChange={handleChange}
          />
          <small>Campo opcional.</small>
        </Field>

        <Field>
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            value={values.content}
            onChange={handleChange}
            required
          />
        </Field>

        <Actions>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : submitLabel}
          </Button>
          <Button
            type="button"
            $variant="secondary"
            disabled={saving}
            onClick={() => navigate('/admin')}
          >
            Cancelar
          </Button>
        </Actions>
      </form>
    </Card>
  );
}

export default PostForm;
