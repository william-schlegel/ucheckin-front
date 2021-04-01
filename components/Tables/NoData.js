import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

const NoDataStyled = styled.div`
  display: flex;
  border: 1px solid var(--offWhite);
  width: 100%;
  height: 100%;
  max-height: 20vh;
  align-items: center;
  justify-content: center;
  padding: 2px 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  background-color: var(--background);
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ededed' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
`;

export default function NoData() {
  const { t } = useTranslation('common');
  return (
    <NoDataStyled>
      <span>{t('no-data')}</span>
    </NoDataStyled>
  );
}
