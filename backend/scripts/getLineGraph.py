import pandas as pd
import matplotlib.pyplot as plt
import sys

def get_place_by_county_code(df, county_code):
    result = df.loc[df['countycode'] == county_code, 'place'].values
    return result[3] if len(result) > 0 else None

def generate_line_graph(csv_path, county):
    df = pd.read_csv(csv_path)

    df = df[df['countycode'] == int(county)] 

    grouped_data = df.groupby('year')['realmediansalesprice'].mean().reset_index()
    place_result = get_place_by_county_code(df, int(county))

    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(grouped_data['year'], grouped_data['realmediansalesprice'], marker='o')
    # plt.title('Average Real Median Sales Price Over Years')
    # plt.xlabel('Year')
    # plt.ylabel('Average Real Median Sales Price')
    plt.grid(True)

    # Set x-axis step to 2
    plt.xticks(range(min(grouped_data['year']), max(grouped_data['year'])+1, 2))

    plt.tight_layout()
    plt.savefig(f'public/{place_result}_linegraph.png')

county = sys.argv[1]
generate_line_graph('C:/Users/chris/OneDrive/Documents/Data Analysis Final Proj/Data_Analysis_Final/backend/data/median_sales_price_2020.csv', county)

