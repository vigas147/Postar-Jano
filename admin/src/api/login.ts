import axios, {AxiosResponse} from "axios";

export interface ISignInResponse {
    token :string;
}

export async function signInUser(username: string, password :string) :Promise<AxiosResponse<ISignInResponse>>  {
    axios.create()
    return axios.post<ISignInResponse>(
        'https://leto.sbb.sk/api/sign/in',
        {username, password},
    )
}