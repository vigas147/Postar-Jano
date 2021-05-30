import axios, {AxiosResponse} from "axios";

export interface ISignInResponse {
    token :string;
}

export async function signInUser(apiHost :string, username: string, password :string) :Promise<AxiosResponse<ISignInResponse>>  {
    axios.create()
    return axios.post<ISignInResponse>(
        `${apiHost}/api/sign/in`,
        {username, password},
    )
}