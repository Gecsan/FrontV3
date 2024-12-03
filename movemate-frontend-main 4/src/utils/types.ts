export type loginFormTypes = {
  email: string;
  password: string;
};

export type User_details_type = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
};

export type quotePayloadType = {
  origin: {
    name: string;
    has_stairs: boolean;
  };
  destination: {
    name: string;
    has_stairs: boolean;
  };
  move_type_id: string;
  move_size_id: string;
  move_date: string;
  email: string;
};

export type serviceType = {
  id?: number;
  name: string;
};

export type scheduleType = {
  id?: number;
  date: string;
  availability: boolean;
  on_schedule: boolean;
  provider_id: number;
};
