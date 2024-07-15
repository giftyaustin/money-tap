import { Network } from "@/pages/chain/Chain"

export type UserInfo = {
    _id: string
    tg_id: string
    tg_username: string
    tg_firstname: string | null
    tg_lastname: string | null
    tg_language_code: string
    phone_number: string | number | null | undefined
    user_acknowledged: boolean
    referred_by: any
    level: number
    pyc_coins: number
    last_tap_time: string | Date
    energy_limit: number
    recharge_time: number
    is_paycio_user: boolean
    paycio_kyc_status: boolean
    selected_country: string | null;
    claimed_ref_rewards: number[]
    selected_token_membership: string | null
    legend_in_countries: string[]
    following_social_media: string[]
    watched_ytVideos: string[]
    hourly_coins_pack_id: number
    coins_to_claim: number
    selected_network: Network | null
    selected_exchange: string | null
    createdAt: string
    level_info: LevelInfo
    country_info: CountryInfo | null
    referrals:User[]
    exchange_info: Activity | null
  }

  export type User = {
    _id: string
    tg_id: string
    tg_username: string | null
    tg_firstname: string | null
    tg_lastname: string | null
    tg_language_code: string
    level: number
    selected_country: string | null;
    is_paycio_user: boolean
    referred_by: any
    pyc_coins: number
    selected_network: string | null
    selected_token_membership: string | null
    selected_exchange: string | null
    following_social_media: string[]
    watched_ytVideos: string[]
    claimed_ref_rewards: number[]
    legend_in_countries: string[]
  }
  
  export type LevelInfo ={
    _id: string
    level_name: string
    level_number: number
    coins_per_tap: number
    coins_to_claim: number
  }
  
  export type CountryInfo = {
    _id: string
    name: string
    touches: number
    country_code: string
  }
  

  export type Stats = {
    levels:LevelInfo[];
    countries:string[]
    total_touches:number
    total_users:number
    daily_users:number
    live_users:number
  }


  export type Activity = {
    _id: string;
    name: string;
    coins: number;
    type: string;
    link: string | null;
    logo: string;
  };
  
  export type Token = {
    _id: string;
    name: string;
    ticker: string;
    coins: number;
    type: string;
    logo: string;
  };
  