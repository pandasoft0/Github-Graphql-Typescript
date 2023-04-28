import React, { useState, useEffect } from "react";
import { graphql } from "@octokit/graphql";
import styled from "styled-components";

interface Repository {
  name: string;
  description: string;
  stargazers: {
    totalCount: number;
  };
  forks: {
    totalCount: number;
  };
}

interface Props {
  username: string;
}

const RepositoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

const RepositoryContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RepositoryName = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
`;

const RepositoryDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
`;

const RepositoryStats = styled.div`
  display: flex;
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
  padding: 8px;
  border-radius: 4px;
`;

const RepositoryStat = styled.span`
  font-size: 14px;
  color: #999;
  margin-right: 16px;
  transition: all 0.2s ease-in-out;

  &:before {
    margin-right: 4px;
  }

  &:hover {
    color: #333;
    transform: scale(1.1);
  }
`;

const RepositoryStars = styled(RepositoryStat)`
  &:before {
    content: "★";
  }
`;

const RepositoryForks = styled(RepositoryStat)`
  &:before {
    content: "🍴";
  }
`;

const RepositoryComponent: React.FC<Props> = ({ username }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    graphql(
      `
        query($username: String!) {
          user(login: $username) {
            repositories(first: 10) {
              nodes {
                name
                description
                stargazers {
                  totalCount
                }
                forks {
                  totalCount
                }
              }
            }
          }
        }
      `,
      {
        username,
        headers: {
          authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
        }
      }
    )
      .then((data: any) => setRepositories(data.user.repositories.nodes))
      .catch((error: any) => console.error(error));
  }, [username]);

  if (repositories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {repositories.map((repository: Repository) => (
        <RepositoryContainer key={repository.name}>
          <RepositoryName>{repository.name}</RepositoryName>
          <RepositoryDescription>
            {repository.description}
          </RepositoryDescription>
          <RepositoryStats>
            <RepositoryStars>
              {repository.stargazers.totalCount} stars
            </RepositoryStars>
            <RepositoryForks>
              {repository.forks.totalCount} forks
            </RepositoryForks>
          </RepositoryStats>
        </RepositoryContainer>
      ))}
    </>
  );
};

export default RepositoryComponent;
