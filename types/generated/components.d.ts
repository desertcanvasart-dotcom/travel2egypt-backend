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
    deluxe_hotels: Schema.Attribute.Text;
    deluxe_tiers: Schema.Attribute.Component<'pricing.tier', true>;
    luxury_hotels: Schema.Attribute.Text;
    luxury_tiers: Schema.Attribute.Component<'pricing.tier', true>;
    standard_hotels: Schema.Attribute.Text;
    standard_tiers: Schema.Attribute.Component<'pricing.tier', true>;
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

export interface WikiAncientQuote extends Struct.ComponentSchema {
  collectionName: 'components_wiki_ancient_quotes';
  info: {
    description: 'Quote or ancient text with source and translation';
    displayName: 'Ancient Quote';
  };
  attributes: {
    original_text: Schema.Attribute.Text;
    source: Schema.Attribute.String & Schema.Attribute.Required;
    translation: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface WikiCaptionedImage extends Struct.ComponentSchema {
  collectionName: 'components_wiki_captioned_images';
  info: {
    description: 'Image with caption for wiki articles';
    displayName: 'Captioned Image';
  };
  attributes: {
    alt_text: Schema.Attribute.String;
    caption: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface WikiComparisonBox extends Struct.ComponentSchema {
  collectionName: 'components_wiki_comparison_boxes';
  info: {
    description: 'Side-by-side comparison of two entities';
    displayName: 'Comparison Box';
  };
  attributes: {
    content_left: Schema.Attribute.RichText & Schema.Attribute.Required;
    content_right: Schema.Attribute.RichText & Schema.Attribute.Required;
    title_left: Schema.Attribute.String & Schema.Attribute.Required;
    title_right: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WikiCultCenter extends Struct.ComponentSchema {
  collectionName: 'components_wiki_cult_centers';
  info: {
    description: 'Major worship locations for gods';
    displayName: 'Cult Center';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    significance: Schema.Attribute.Text;
    temple: Schema.Attribute.String;
  };
}

export interface WikiFactBox extends Struct.ComponentSchema {
  collectionName: 'components_wiki_fact_boxes';
  info: {
    description: 'Quick facts for kings, gods, dynasties';
    displayName: 'Fact Box';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WikiFamilyMember extends Struct.ComponentSchema {
  collectionName: 'components_wiki_family_members';
  info: {
    description: 'Family relationships for pharaohs';
    displayName: 'Family Member';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    relationship: Schema.Attribute.Enumeration<
      ['father', 'mother', 'wife', 'son', 'daughter', 'brother', 'sister']
    > &
      Schema.Attribute.Required;
  };
}

export interface WikiTimelineEntry extends Struct.ComponentSchema {
  collectionName: 'components_wiki_timeline_entries';
  info: {
    description: 'Year or period with description for chronological events';
    displayName: 'Timeline Entry';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    year_or_period: Schema.Attribute.String & Schema.Attribute.Required;
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
      'wiki.ancient-quote': WikiAncientQuote;
      'wiki.captioned-image': WikiCaptionedImage;
      'wiki.comparison-box': WikiComparisonBox;
      'wiki.cult-center': WikiCultCenter;
      'wiki.fact-box': WikiFactBox;
      'wiki.family-member': WikiFamilyMember;
      'wiki.timeline-entry': WikiTimelineEntry;
    }
  }
}
