import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Tag } from '../styles/ui';
import { buildExcerpt, formatDate } from '../utils/format';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  h2 {
    margin: 0;
    font-size: 1.15rem;
  }
`;

const Meta = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Excerpt = styled.p`
  margin: 0;
  flex: 1;
`;

function PostCard({ post }) {
  return (
    <Card>
      {post.subject && <Tag>{post.subject}</Tag>}

      <h2>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>

      <Meta>
        Por {post.author}
        {post.createdAt && ` · ${formatDate(post.createdAt)}`}
      </Meta>

      <Excerpt>{buildExcerpt(post.content)}</Excerpt>

      <Link to={`/posts/${post.id}`} aria-label={`Ler a postagem ${post.title}`}>
        Ler postagem
      </Link>
    </Card>
  );
}

export default PostCard;
