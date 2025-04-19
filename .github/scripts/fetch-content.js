const axios = require('axios');
const fs = require('fs-extra');

const WORDPRESS_URL = process.env.WORDPRESS_URL;

async function fetchContent() {
  try {
    // Buscar posts do WordPress via GraphQL
    const response = await axios.post(WORDPRESS_URL, {
      query: `
        {
          posts {
            nodes {
              id
              slug
              title
              date
              content
              excerpt
              categories {
                nodes {
                  name
                  slug
                }
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
          }
          pages {
            nodes {
              id
              slug
              title
              content
            }
          }
        }
      `
    });

    const { posts, pages } = response.data.data;
    
    // Garantir que o diretório de conteúdo existe
    await fs.ensureDir('./content');
    
    // Salvar posts em formato JSON
    await fs.writeJson('./content/posts.json', posts.nodes, { spaces: 2 });
    
    // Salvar páginas em formato JSON
    await fs.writeJson('./content/pages.json', pages.nodes, { spaces: 2 });
    
    console.log('Conteúdo do WordPress atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao buscar conteúdo do WordPress:', error);
    process.exit(1);
  }
}

fetchContent();
