import React, { useState, useEffect } from "react";
import { graphql } from "@octokit/graphql";
import dotenv from "dotenv";
import styled from "styled-components";

dotenv.config();

const UserComponentContainer = styled.div`
  border: 1px solid gray;
  padding: 1rem;
  font-family: sans-serif;
  font-size: 1.2rem;
`;

const UserImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  margin-top: 0;
`;

const UserBio = styled.p`
  margin-bottom: 0.5rem;
`;

const UserLocation = styled.p`
  margin-bottom: 0;
`;

interface User {
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
}

interface Props {
  username: string;
}

const UserComponent: React.FC<Props> = ({ username }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    graphql(
      `
        query($username: String!) {
          user(login: $username) {
            name
            avatarUrl
            bio
            location
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
      .then((data: any) => setUser(data.user))
      .catch((error: any) => console.error(error));
  }, [username]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <UserComponentContainer>
      <UserImage src={user.avatarUrl} alt={user.name} />
      <UserName>{user.name}</UserName>
      <UserBio>{user.bio}</UserBio>
      <UserLocation>{user.location}</UserLocation>
    </UserComponentContainer>
  );
};

export default UserComponent;
