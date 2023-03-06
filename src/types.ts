//https://doc.devptt.dev/

import CSS from 'csstype'
import { TableProps } from 'fixed-data-table-2'

import { State as State_r } from "react-reducer-utils"

export interface State_t extends State_r {
    errmsg?: string
}

export interface Data {
}

export interface IdxData {
    numIdx: number
}

export type List<T extends IdxData> = {
    list: T[]
    start_num_idx?: number
    next_idx: string
}

export type TableData = any[]

export type Color = {
    foreground?: number
    background?: number
    blink?: boolean
    highlight?: boolean
    reset?: boolean
}

export type Rune_t = {
    text: string
    color0: Color
    color1?: Color
    pullright?: boolean
}

export type Runes_t = Rune_t[]

export type AccessToken = {
    user_id: string
    access_token: string
    token_type: string
}

export type Username = {
    username: string
}

export type UserID = {
    user_id: string
}

export type AccountLoginParams = {
    client_id: string
    client_secret: string
    username: string
    password: string
}

export type AccountRegisterParams = {
    client_id: string
    client_secret: string
    username: string
    password: string
    password_confirm: string
    over18: boolean
    email: string
    nickname: string
    realname?: string
    career?: string
    address?: string
}

export type Content = Rune_t[][]

export type Line = {
    runes: Runes_t
    idx?: string
    background?: number
}

export type Maybe<T> = {
    [p in keyof T]?: T[p]
}

export type ArticleDetail = {
    bid: string
    aid: string
    deleted: boolean
    filename: string
    create_time: number
    modified: number
    recommend: number
    n_comments: number
    owner: string
    date: string
    title: string
    money: number
    type: string
    class: string
    mode: number
    url: string
    read: boolean
    idx: string
    rank: number
    subject_type: number
    brdname: string
    content: Content
    prefix: Content
    nickname: string
    ip: string
    host: string
    bbs: string
}

export interface ArticleSummary {
    aid: string
    bid: string
    deleted: boolean
    filename: string
    create_time: number
    modified: number
    recommend: number
    n_comments: number
    owner: string
    date: string
    title: string
    money: number
    type: string
    class: string
    mode: number
    url: string
    read: boolean
    idx: string
    rank: number
    subject_type: number
}

export interface ArticleSummary_i extends ArticleSummary, IdxData { }

export interface ArticleList extends List<ArticleSummary_i> {
    next_create_time: number
}

export type ArticleBlock = {
    content: Content
    deleted: boolean
    create_time: number
    modified: number
    recommend: number
    n_comments: number
    rank: number
    title: string
    money: number
    class: string
    mode: number
    owner: string
    ip: string
    host: string
    bbs: string
    next_idx: string
}

export type BoardDetail = {
    bid: string
    brdname: string
    title: string
    flag: number
    type: string
    class: string
    nuser: number
    moderators: string[]
    reason: string
    read: boolean
    total: number
    last_post_time: number
    stat_attr: number
    level_idx: string
    gid: number
    update_time: number
    vote_limit_logins: number
    post_limit_logins: number
    vote_limit_bad_post: number
    post_limit_bad_post: number
    vote: number
    vtime: number
    perm: number
    last_set_time: number
    post_expire: number
    end_gamble: number
    post_type: string
    fast_recommend_pause: number
}

export interface BoardSummary {
    bid: string
    brdname: string
    title: string
    flag: number
    type: string
    class: string
    nuser: number | string
    moderators: string[]
    reason: string
    read: boolean
    total: number
    last_post_time: number
    stat_attr: number
    level_idx: string
    gid: number
    url?: string
    pttbid: number
    idx: string
}

export interface BoardSummary_i extends BoardSummary, IdxData { }

export type BoardList = List<BoardSummary_i>

export type Comment = {
    bid: string
    aid: string
    cid: string
    type: number
    refid: string
    deleted: boolean
    create_time: number
    sort_time: number
    owner: string
    content: Content
    ip: string
    host: string
    idx: string
}

export interface Comment_i extends Comment, IdxData { }

export type CommentList = List<Comment_i>

export type UserDetail = {
    user_id: string
    username: string
    nickname: string
    realname: string
    flag: number
    perm: number
    login_days: number
    posts: number
    first_login: number
    last_login: number
    last_ip: string
    last_host: string
    money: number
    pttemail: string
    justify: string
    over18: boolean
    pager_ui: number
    pager: number
    invisible: boolean
    exmail: number
    career: string
    role: number
    last_seen: number
    time_set_angel: number
    time_play_angel: number
    last_song: number
    login_view: number
    violation: number

    five_win: number
    five_lose: number
    five_tie: number

    chc_win: number
    chc_lose: number
    chc_tie: number

    conn6_win: number
    conn6_lose: number
    conn6_tie: number

    go_win: number
    go_lose: number
    go_tie: number

    dark_win: number
    dark_lose: number
    dark_tie: number

    chess_rank: number

    ua_version: number

    signature: number
    badpost: number
    angel: string
    time_remove_bad_post: number
    time_violate_law: number
    deleted: boolean
    update_ts: number
    perm2: boolean

    email: string
    email_ts: number
    twofactor_enabled: boolean
    twofactor_enabled_ts: number
    idemail: string
    idemail_set: boolean
    idemail_ts: number
}

export type UserListSummary = {
    username: string
    nickname: string
    last_ip: string
    last_host: string
    last_action: string
    last_action_time: number
    pager: number
}

export type UserSummary = {
    username: string
    nickname: string
    login_days: number
    post: number
    last_action: string
    last_action_time: number
    last_login: number
    badpost: number
    money: number
    five_win: number
    five_lose: number
    five_tie: number
    chc_win: number
    chc_lose: number
    chc_tie: number

    conn6_win: number
    conn6_lose: number
    conn6_tie: number

    go_win: number
    go_lose: number
    go_tie: number

    dark_win: number
    dark_lose: number
    dark_tie: number

    chess_rank: number
}

export type ChangePasswdParams = {
    client_id: string
    client_secret: string
    orig_password: string
    password: string
    password_confirm: string
}

export type AttemptChangeEmailParams = {
    client_id: string
    client_secret: string
    password: string
    email: string
}

export type AttemptChangeEmailResult = {
    user_id: string
    email: string
}

export type ChangeEmailParams = {
    client_id: string
    client_secret: string
    token: string
}

export type ChangeEmailResult = {
    email: string
}

export type AttemptSetIDEmailParams = {
    client_id: string
    client_secret: string
    password: string
    email: string
}

export type AttemptSetIDEmailResult = {
    user_id: string
    email: string
}

export type SetIDEmailParams = {
    client_id: string
    client_secret: string
    token: string
}

export type SetIDEmailResult = {
    email: string
}

export type ArticleComment = {
    bid: string
    aid: string
    cid: string
    deleted: boolean
    create_time: number
    modified: number
    recommend: number
    n_comments: number
    owner: string
    title: string
    money: number
    class: string
    url: string
    read: boolean
    idx: string
    rank: number
    type: string

    ctype: number
    ctime: number
    comment: Content
}

export interface ArticleComment_i extends ArticleComment, IdxData { }

export type ArticleCommentList = List<ArticleComment_i>

export type ManArticleSummary = {
    aid: string
    bid: string
    level_idx: string
    create_time: number
    modified: number
    title: string
    is_dir: boolean
    url: string
}

export interface ManArticleSummary_i extends ManArticleSummary, IdxData { }

export interface ManArticleList extends List<ManArticleSummary_i> {
    next_create_time: number
}

export type ManArticle = {
    bid: string
    aid: string
    level_idx: string
    deleted: boolean
    create_time: number
    modified: number
    title: string
    is_dir: boolean
    content: Content
    url: string
}

export type ManArticleBlock = {
    content: Content
    deleted: boolean
    create_time: number
    modified: number
    title: string
    next_idx: string
}

export type Rank_t = {
    rank: number
}

export type PttColumn = {
    Header: string
    accessor: string
    width: number
    fixed: boolean
    type?: string
    headerTextAlign?: CSS.Property.TextAlign
}

export type PttOption = {
    text: string
    url?: string
    hotkey?: string
    action?: Function
}

export type PttClass = {
    value: string
    label: string
}

export type RecommendType = {
    value: number
    label: string
}

export type TableProps_m = Maybe<TableProps>

export type CharProp = {
    char: string
    codePoint: number
    scaleWidth: number
    scaleHeight: number
    width: number
    height: number
}

export type CharPropMap = {
    [key: string]: CharProp
}

export type CharMap = {
    width: number
    height: number
    charMap: CharPropMap
}

export type Consts = {
    CHAR_WIDTH: number
    SCREEN_WIDTH: number
    EDIT_SCREEN_WIDTH: number
    BASE_COLUMN_WIDTH: number
    LINE_HEIGHT: number
    IS_INIT: boolean
}