import type { Schema, Struct } from '@strapi/strapi';

export interface BlogDetails extends Struct.ComponentSchema {
  collectionName: 'components_blog_details';
  info: {
    displayName: 'details';
    icon: 'file';
  };
  attributes: {
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    read_time: Schema.Attribute.String;
  };
}

export interface CruiseItinerary extends Struct.ComponentSchema {
  collectionName: 'components_cruise_itineraries';
  info: {
    displayName: 'itinerary';
    icon: 'ship';
  };
  attributes: {
    departure_days: Schema.Attribute.String;
    details: Schema.Attribute.RichText;
    duration: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    route: Schema.Attribute.String;
  };
}

export interface PricingTier extends Struct.ComponentSchema {
  collectionName: 'components_pricing_tiers';
  info: {
    displayName: 'tier';
    icon: 'priceTag';
  };
  attributes: {
    group_size: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
  };
}

export interface TourChildPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_child_pricings';
  info: {
    displayName: 'child_pricing';
    icon: 'child';
  };
  attributes: {
    child_age_limit: Schema.Attribute.Integer;
    child_discount_available: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    child_discount_percentage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
  };
}

export interface TourDetails extends Struct.ComponentSchema {
  collectionName: 'components_tour_details';
  info: {
    displayName: 'details';
    icon: 'file';
  };
  attributes: {
    average_rating: Schema.Attribute.Decimal;
    duration: Schema.Attribute.String;
    exclusions: Schema.Attribute.RichText;
    group_size: Schema.Attribute.String;
    highlights: Schema.Attribute.RichText;
    important_info: Schema.Attribute.RichText;
    inclusions: Schema.Attribute.RichText;
    itinerary_detailed: Schema.Attribute.Component<'tour.itinerary-day', true>;
    itinerary_simple: Schema.Attribute.RichText;
    itinerary_type: Schema.Attribute.Enumeration<['simple', 'detailed']>;
    languages: Schema.Attribute.String;
    overview: Schema.Attribute.RichText;
    physical_level: Schema.Attribute.Enumeration<
      ['easy', 'moderate', 'challenging']
    >;
    pickup_time: Schema.Attribute.String;
    reviews: Schema.Attribute.Component<'tour.review', true>;
    what_to_bring: Schema.Attribute.RichText;
  };
}

export interface TourGroupDetails extends Struct.ComponentSchema {
  collectionName: 'components_tour_group_details';
  info: {
    displayName: 'group_details';
    icon: 'users';
  };
  attributes: {
    guaranteed_departure: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    maximum_group_size: Schema.Attribute.Integer;
    minimum_group_size_per_booking: Schema.Attribute.Integer;
  };
}

export interface TourGroupPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_group_pricings';
  info: {
    displayName: 'group_pricing';
    icon: 'users';
  };
  attributes: {
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'USD'>;
    fixed_price: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface TourItineraryDay extends Struct.ComponentSchema {
  collectionName: 'components_tour_itinerary_days';
  info: {
    displayName: 'itinerary_day';
    icon: 'calendar';
  };
  attributes: {
    accommodation: Schema.Attribute.String;
    day_description: Schema.Attribute.RichText;
    day_number: Schema.Attribute.Integer;
    day_title: Schema.Attribute.String & Schema.Attribute.Required;
    meals: Schema.Attribute.String;
  };
}

export interface TourOperatingSchedule extends Struct.ComponentSchema {
  collectionName: 'components_tour_operating_schedules';
  info: {
    displayName: 'operating_schedule';
    icon: 'clock';
  };
  attributes: {
    departure_time: Schema.Attribute.String;
    operating_days: Schema.Attribute.String;
  };
}

export interface TourPackagePricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_package_pricings';
  info: {
    displayName: 'package_pricing';
    icon: 'package';
  };
  attributes: {
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'USD'>;
    pricing_tiers: Schema.Attribute.Component<'pricing.tier', true>;
  };
}

export interface TourPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_pricings';
  info: {
    displayName: 'pricing';
    icon: 'dollar';
  };
  attributes: {
    horus_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
    pharaohs_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
    ra_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
  };
}

export interface TourReview extends Struct.ComponentSchema {
  collectionName: 'components_tour_reviews';
  info: {
    displayName: 'review';
    icon: 'star';
  };
  attributes: {
    country: Schema.Attribute.String;
    custumer_name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    review_date: Schema.Attribute.Date;
    review_text: Schema.Attribute.Text;
    review_title: Schema.Attribute.String;
    verified_purchase: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blog.details': BlogDetails;
      'cruise.itinerary': CruiseItinerary;
      'pricing.tier': PricingTier;
      'tour.child-pricing': TourChildPricing;
      'tour.details': TourDetails;
      'tour.group-details': TourGroupDetails;
      'tour.group-pricing': TourGroupPricing;
      'tour.itinerary-day': TourItineraryDay;
      'tour.operating-schedule': TourOperatingSchedule;
      'tour.package-pricing': TourPackagePricing;
      'tour.pricing': TourPricing;
      'tour.review': TourReview;
    }
  }
}
