import {translations} from '../../services/api';

const getTranslation = (params) => {
  return (dispatch) => {
    return translations
      .getTranslation(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in translations getTranslation action', err);
        return err.response;
      });
  };
};

export const translatesAction = {
  getTranslation,
};
