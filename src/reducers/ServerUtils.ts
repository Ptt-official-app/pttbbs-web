import config from 'config'
import { AccessToken, ArticleDetail, ArticleList, ArticleSummary, BoardList, BoardSummary, CommentList, Content, Data, ManArticle, ManArticleList, Rank_t, UserDetail, UserID, Username } from '../types'
import { Query, CallAPI } from './api'

const LIST_LIMIT = config.LIST_LIMIT || 50

export const Login = (username: string, password: string): CallAPI<AccessToken> => ({
    endpoint: '/api/account/login',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],

        username,
        password,
    },
})

export const AttemptRegister = (username: string, email: string): CallAPI<Username> => ({
    endpoint: '/api/account/attemptregister',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],
        username,
        email,
    },
})

export const Register = (username: string, password: string, password_confirm: string, email: string, over18: boolean, veriCode: string): CallAPI<AccessToken> => ({
    endpoint: '/api/account/register',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],

        username,
        password,
        password_confirm,
        email,
        over18,
        token: veriCode,
    },
})

export const GetUserInfo = (userID: string): CallAPI<UserDetail> => ({
    endpoint: '/api/user/' + userID,
    method: 'get',
})

export const GetUserID = (): CallAPI<UserID> => ({
    endpoint: '/api/userid',
    method: 'get',
})

export const ChangePasswd = (userID: string, origPassword: string, password: string, passwordConfirm: string): CallAPI<AccessToken> => ({
    endpoint: '/api/user/' + userID + '/updatepasswd',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],

        orig_password: origPassword,
        password,
        password_confirm: passwordConfirm,
    },
})

export const AttemptChangeEmail = (userID: string, password: string, email: string): CallAPI<UserID> => ({
    endpoint: '/api/user/' + userID + '/attemptchangeemail',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],

        password,
        email,
    },
})

export const ChangeEmail = (userID: string, token: string): CallAPI<Data> => ({
    endpoint: '/api/user/' + userID + '/changeemail',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],
        token,
    },
})

export const AttemptSetIDEmail = (userID: string, password: string, email: string): CallAPI<UserID> => ({
    endpoint: '/api/user/' + userID + '/attemptsetidemail',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],

        password,
        email,
    },
})

export const SetIDEmail = (userID: string, token: string): CallAPI<Data> => ({
    endpoint: '/api/user/' + userID + '/setidemail',
    method: 'post',
    json: {
        client_id: config['CLIENT_ID'],
        client_secret: config['CLIENT_SECRET'],
        token,
    },
})

export const GetBoardSummary = (bid: string): CallAPI<BoardSummary> => ({
    endpoint: '/api/board/' + bid + '/summary',
    method: 'get',
})

export const LoadFavoriteBoards = (userID: string, level: string, startIdx: string, desc: boolean): CallAPI<BoardList> => ({
    endpoint: '/api/user/' + userID + '/favorites',
    method: 'get',
    query: {
        level_idx: level || '',
        start_idx: startIdx || '',
        asc: !desc,
        limit: LIST_LIMIT,
    },
})

export const LoadPopularBoards = (): CallAPI<BoardList> => ({
    endpoint: '/api/boards/popular',
})

export const LoadGeneralBoardsByClass = (keyword: string, startIdx: string, desc: boolean): CallAPI<BoardList> => ({
    endpoint: '/api/boards/byclass',
    query: {
        keyword: keyword || '',
        start_idx: startIdx || '',
        asc: !desc,
        limit: LIST_LIMIT,
    },
})

export const LoadGeneralBoards = (keyword: string, startIdx: string, desc: boolean): CallAPI<BoardList> => ({
    endpoint: '/api/boards',
    query: {
        keyword: keyword || '',
        start_idx: startIdx || '',
        asc: !desc,
        limit: LIST_LIMIT,
    },
})

export const LoadClassBoards = (clsID: number, startIdx: string, desc: boolean): CallAPI<BoardList> => ({
    endpoint: '/api/cls/' + clsID,
    query: {
        start_idx: startIdx || '',
        asc: !desc,
        limit: LIST_LIMIT,
    },
})

export const LoadArticles = (bid: string, title: string, startIdx: string, desc: boolean): CallAPI<ArticleList> => {
    let query = {
        title: title || '',
        start_idx: startIdx || '',
        limit: LIST_LIMIT,
        desc: desc || false,
    }

    return {
        endpoint: '/api/board/' + bid + '/articles',
        method: 'get',
        query: query,
    }
}

export const LoadBottomArticles = (bid: string): CallAPI<ArticleList> => ({
    endpoint: '/api/board/' + bid + '/articles/bottom',
    method: 'get',
})

export const GetArticle = (bid: string, aid: string): CallAPI<ArticleDetail> => {
    return {
        endpoint: '/api/board/' + bid + '/article/' + aid,
        method: 'get',
    }
}

export const GetComments = (bid: string, aid: string, startIdx: string, desc: boolean): CallAPI<CommentList> => {
    let query: Query = {
        start_idx: startIdx || '',
        limit: LIST_LIMIT,
    }
    if (typeof desc !== 'undefined') {
        query.desc = desc
    }
    return {
        endpoint: '/api/board/' + bid + '/article/' + aid + '/comments',
        method: 'get',
        query: query,
    }
}

export const CreateArticle = (bid: string, theClass: string, title: string, content: Content): CallAPI<ArticleSummary> => {
    return {
        endpoint: '/api/board/' + bid + '/article',
        method: 'post',
        json: {
            class: theClass,
            title,
            content,
        },
    }
}

export const AddRecommend = (bid: string, aid: string, recommendType: string, recommend: Content): CallAPI<Comment> => {
    return {
        endpoint: `/api/board/${bid}/article/${aid}/comment`,
        method: 'post',
        json: {
            type: recommendType,
            content: recommend,
        },
    }
}

export const Rank = (bid: string, aid: string, rank: number): CallAPI<Rank_t> => {
    return {
        endpoint: `/api/board/${bid}/article/${aid}/rank`,
        method: 'post',
        json: {
            rank: rank,
        },
    }
}

export const LoadManuals = (bid: string, path: string, desc: boolean): CallAPI<ManArticleList> => {
    let query: Query = {
        level_idx: path,
    }
    if (typeof desc !== 'undefined') {
        query.desc = desc
    }
    return {
        endpoint: `/api/board/${bid}/manuals`,
        method: 'get',
        query: query,
    }
}

export const GetManual = (bid: string, path: string): CallAPI<ManArticle> => {
    return {
        endpoint: `/api/board/${bid}/manual/${path}`,
        method: 'get',
    }
}