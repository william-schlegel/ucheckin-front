import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

const NoDataStyled = styled.div`
  display: block;
  border: 1px solid var(--offWhite);
  width: 100%;
  padding: 2px 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export default function NoData() {
  const { t } = useTranslation('common');
  return <NoDataStyled>{t('no-data')}</NoDataStyled>;
}
