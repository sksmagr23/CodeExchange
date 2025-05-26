const axios = require("axios");

exports.searchStackOverflowQuestions = async (req, res) => {
  try {
    const { query, tags, page = 2, pagesize = 100 } = req.query;

    const params = {
      site: "stackoverflow",
      page,
      pagesize,
      order: "desc",
      sort: "activity",
      filter: "withbody",
    };
    
    if (query && query.trim() !== '') {
      params.intitle = query.trim();
    }

    if (tags && tags.trim() !== '') {
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .join(';');
      
      params.tagged = formattedTags;
    }

    const response = await axios.get(
      "https://api.stackexchange.com/2.3/questions",
      { params }
    );

    res.render("stackoverflow-search", {
      title: "Stack Overflow Search",
      user: req.user,
      results: response.data.items,
      query,
      tags,
      currentPage: parseInt(page),
      hasMore: response.data.has_more,
      totalResults: response.data.items.length,
    });
  } catch (error) {
    console.error("Error searching Stack Overflow:", error);
    res.status(500).render("error", {
      message: "Error fetching data from Stack Overflow",
      user: req.user,
    });
  }
};

exports.getStackOverflowQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const questionResponse = await axios.get(
      `https://api.stackexchange.com/2.3/questions/${id}`,
      {
        params: {
          site: "stackoverflow",
          filter: "withbody",
        },
      }
    );

    const answersResponse = await axios.get(
      `https://api.stackexchange.com/2.3/questions/${id}/answers`,
      {
        params: {
          site: "stackoverflow",
          filter: "withbody",
          order: "desc",
          sort: "votes",
        },
      }
    );

    if (
      !questionResponse.data.items ||
      questionResponse.data.items.length === 0
    ) {
      return res.status(404).render("404", {
        title: "Question not found",
        user: req.user,
      });
    }

    res.render("stackoverflow-question", {
      title: "Stack Overflow Question",
      user: req.user,
      question: questionResponse.data.items[0],
      answers: answersResponse.data.items,
    });
  } catch (error) {
    console.error("Error fetching Stack Overflow question:", error);
    res.status(500).render("error", {
      message: "Error fetching data from Stack Overflow",
      user: req.user,
    });
  }
};
