import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import sys


df = pd.read_csv('C:/Users/chris/OneDrive/Documents/Data Analysis Final Proj/Data_Analysis_Final/backend/data/10y_median_house_income_florida.csv')

# New column names
new_columns_names = ['county', '2021', '2020', '2019', '2018', '2017',
                     '2016', '2015', '2014', '2013', '2012']

# Rename columns using the dictionary
df.columns = new_columns_names
df.drop(index=df.index[0], axis=0, inplace=True)
df.drop(index=df.index[0], axis=0, inplace=True)
df.drop(['2021'], axis=1, inplace=True)


def plot_median_income_by_county(county):
    # Set 'county' column as the index
    df.set_index('county', inplace=True)

    # Transpose the DataFrame to have years as rows and counties as columns
    df_transposed = df.T

    # Reverse the order of columns (years)
    df_transposed = df_transposed[::-1]

    # Check if the provided county exists in the DataFrame
    if county not in df_transposed.columns:
        print(f"County '{county}' not found in the dataset.")
        return

    # Plot the data for the specified county
    df_transposed[county].plot(kind='line', marker='o', linestyle='-', figsize=(10, 6))

    # Customize the plot
    plt.title(f'Median Income Over Years for {county} County')
    plt.xlabel('Year')
    plt.ylabel('Median Income')
    plt.legend([county], title='County', loc='upper left')

    # Show the plot
    #plt.show()

    plt.savefig('sample_{}'.format(county))

#---------------------------------------------------------------------
#---------------------------------------------------------------------
#---------------------------------------------------------------------
#---------------------------------------------------------------------

# Filter columns: 'place', 'year', 'realmediansalesprice'
new_data = df[['place', 'year', 'realmediansalesprice']]

# Filter years from 2012 to 2020
new_data = new_data[new_data['year'].between(2012, 2020)]

# Remove 'County' from each cell in the 'place' column
new_data['place'] = new_data['place'].str.replace(' County', '')

# Pivot the DataFrame to match the structure of the original one
new_data_pivoted = new_data.pivot_table(index='place', columns='year', values='realmediansalesprice', aggfunc='first')

# Reset the index to make 'place' a regular column
new_data_pivoted.reset_index(inplace=True)

# Rename the columns to match the original format
new_data_pivoted.columns = ['county'] + [str(year)+'_sales' for year in range(2012, 2021)]

# Merge the reshaped new data with the original DataFrame based on 'county'
merged_data = pd.merge(df, new_data_pivoted, on='county', how='left')

# Display the reshaped DataFrame
print(merged_data)

def plot_sales_vs_real_values_for_county(county):
    plt.figure(figsize=(10, 6))

    bar_width = 0.35
    years = [str(year) for year in range(2012, 2021)]
    real_values = [merged_data.loc[merged_data['county'] == county, str(year)].values[0] for year in years]
    sales_values = [merged_data.loc[merged_data['county'] == county, f'{year}_sales'].values[0] for year in years]

    plt.bar(np.arange(len(years)), real_values, bar_width, label='Median Income', color='blue', align='center')
    plt.bar(np.arange(len(years)) + bar_width, sales_values, bar_width, label='Median Sales Value', color='orange', align='center')

    plt.title(f'Real Values vs Sales for {county} County (2012-2020)')
    plt.xlabel('Year')
    plt.ylabel('Values')
    plt.legend()
    plt.xticks(np.arange(len(years)) + bar_width / 2, years)

    plt.tight_layout()
    plt.savefig(f'public/{county}_bargraph.png')
    
county = sys.argv[1]
plot_sales_vs_real_values_for_county(county)
