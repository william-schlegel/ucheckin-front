import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Download } from 'react-feather';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styled from 'styled-components';
import { Help, HelpButton, useHelp } from '../components/Help';
import {
  Block,
  FormBodyFull,
  FormHeader,
  FormTitle,
  H2,
} from '../components/styles/Card';
import { ButtonStyled } from '../components/styles/Button';
import client from '../apollo-client';

const QUERY_SDK = gql`
  query QUERY_SDK {
    sdks {
      id
      name
      link
      content
      language
      image {
        id
        publicUrlTransformed(transformation: { width: "800", height: "800" })
      }
    }
  }
`;

export default function Sdk({ initialData = [] }) {
  const { t, lang } = useTranslation('sdk');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('sdk');
  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <FormHeader>
        <FormTitle>
          <Block>
            <H2>{t('sdk')}</H2>
            <HelpButton showHelp={toggleHelpVisibility} />
          </Block>
        </FormTitle>
      </FormHeader>
      <FormBodyFull>
        {initialData
          .filter((sdk) => sdk.language === lang)
          .map((sdk) => (
            <SdkBlock key={sdk.id} sdkData={sdk} />
          ))}
      </FormBodyFull>
    </>
  );
}

Sdk.propTypes = { initialData: PropTypes.array };

const SdkBlockStyled = styled.div`
  display: block;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-grey);
  img {
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    margin-right: 2rem;
    align-self: center;
    filter: drop-shadow(var(--drop-shadow));
  }
  .sdk-block {
    display: flex;
  }
  .content {
    display: flex;
    flex-direction: column;
    font-size: 1.25rem;
    justify-content: space-between;
    .body {
      display: block;
      strong {
        color: var(--primary);
      }
      em {
        color: var(--secondary);
      }
      h2 {
        color: var(--primary);
        font-size: 1.25em;
      }
      a {
        display: inline-block;
        padding: 0.1em 0.5em;
        margin: 0.1em;
        border-radius: 5px;
        color: var(--primary);
        border: 1px solid var(--primary);
        &:hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }
      }
    }
  }
`;

function SdkBlock({ sdkData }) {
  const { content } = sdkData;
  const { t } = useTranslation('sdk');

  return (
    <SdkBlockStyled>
      <FormTitle>
        <H2>{sdkData.name}</H2>
      </FormTitle>
      <div className="sdk-block">
        {sdkData.image.publicUrlTransformed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sdkData.image.publicUrlTransformed}
            alt={sdkData.image.name}
          />
        )}
        <div className="content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="body">
            {content}
          </ReactMarkdown>
          <div>
            <a
              href={sdkData.link}
              target="_blank"
              alt={sdkData.name}
              rel="noreferrer"
            >
              <ButtonStyled>
                <Download />
                <span>{t('download')}</span>
              </ButtonStyled>
            </a>
          </div>
        </div>
      </div>
    </SdkBlockStyled>
  );
}

SdkBlock.propTypes = { sdkData: PropTypes.object };

export async function getServerSideProps() {
  const { data } = await client.query({ query: QUERY_SDK });
  return {
    props: {
      initialData: data.sdks,
    },
  };
}
