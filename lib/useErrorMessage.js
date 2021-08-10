import { useToasts } from 'react-toast-notifications';

export default function useErrorMessage() {
  const { addToast } = useToasts();

  function displayError({ graphqlError, msgError }) {
    if ((!graphqlError || !graphqlError.message) && !msgError) return;
    const msg = [];
    if (
      graphqlError.networkError &&
      graphqlError.networkError.result &&
      graphqlError.networkError.result.errors.length
    )
      graphqlError.networkError.result.errors.forEach((e) =>
        msg.push(e.message.replace('GraphQL error: ', ''))
      );
    if (graphqlError.message)
      msg.push(graphqlError.message.replace('GraphQL error: ', ''));
    if (msgError) msg.push(msgError);
    addToast(msg.join('<br>'), { appearance: 'error' });
  }
  return displayError;
}
