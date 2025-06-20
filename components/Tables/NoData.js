import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

const NoDataStyled = styled.div`
  display: flex;
  border: 1px solid var(--off-white);
  width: 100%;
  align-items: center;
  justify-content: center;
  height: calc(100% - 1rem);
  padding: 2px 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  background-color: var(--background);
  background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' fill='%23aaaaaa' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
  /* background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23888888' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E"); */
  max-height: 25vh;
  span {
    background-color: transparent;
  }
`;

/* <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg> */

export default function NoData() {
  const { t } = useTranslation('common');

  return (
    <NoDataStyled>
      <span>{t('no-data')}</span>
    </NoDataStyled>
  );
}
